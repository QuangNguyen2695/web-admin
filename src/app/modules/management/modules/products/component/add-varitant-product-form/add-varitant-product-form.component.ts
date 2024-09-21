import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-add-varitant-product-form',
  templateUrl: './add-varitant-product-form.component.html',
  styleUrl: './add-varitant-product-form.component.scss',
})
export class AddVaritantProductFormComponent {
  formOptionsGroup: any;
  payLoad: any;

  variantsForm: FormGroup = new FormGroup({});
  isImage: boolean = true;
  isFixedForm: boolean = false;

  option_values: any;

  listOfOptions: any = [];

  _indexComponent: number | undefined;

  duplicates: any = [];

  @Output() emitDeletion = new EventEmitter<number>();

  @Output() emitOptionsAndVariants = new EventEmitter<any>();

  @Output() emitOpenSetupOptionsAndVariants = new EventEmitter<any>();


  constructor(private fb: FormBuilder) { }

  init(index: number, formOptionsGroup: any, isFixedForm: boolean, listOfOptions: any) {
    this._indexComponent = index;
    this.formOptionsGroup = formOptionsGroup;
    this.isFixedForm = isFixedForm;
    this.listOfOptions = listOfOptions;
  }

  ngOnInit() {
    this.setOptionValuesForm();
    this.option_values = this.formOptionsGroup.controls['option_values'] as FormArray;
    this.option_values.push(this.variantsForm);
    this.option_values.setValidators(this.customDuplicateValidator);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control: any) => {
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onSubmit(isAuto?: boolean) {
    if (!this.formOptionsGroup.valid) {
      this.markFormGroupTouched(this.formOptionsGroup);
      return;
    }
    this.formOptionsGroup.controls['isOptionSetup'].value = false;
    this.emitOptionsAndVariants.emit(this._indexComponent);
  }

  onAutoOptionSubmit() {
    this.emitOptionsAndVariants.emit(this._indexComponent);
  }

  getValidityFormGroup(variant: FormGroup, controlName: string) {
    const variantFromControl = variant.controls[controlName] as any;
    const errorsVariantFromControl = variantFromControl;
    return errorsVariantFromControl;
  }

  getValueFormGroup(variant: FormGroup, controlName: string) {
    const variantFromControl = variant.controls[controlName] as any;
    if (variantFromControl && !variantFromControl.value) return '';
    return variantFromControl.value;
  }

  setValueFormGroup(variant: FormGroup, controlName: string, value: any) {
    const variantFromControl = variant.controls[controlName] as any;
    if (variantFromControl && !variantFromControl.value) return;
    variantFromControl.value = value;
  }

  addVariant() {
    const optionsValuesFrom = <FormGroup>this.option_values;
    if (!optionsValuesFrom.valid || !this.formOptionsGroup.valid) {
      return;
    }
    this.setOptionValuesForm();
    this.option_values.push(this.variantsForm);
  }

  setOptionValuesForm() {
    if (this.isFixedForm && this.isImage) {
      this.variantsForm = this.fb.group({
        ['image']: new FormControl('', [Validators.required]),
        ['name']: new FormControl('', [Validators.required]),
      });
      return;
    }
    this.variantsForm = this.fb.group({
      ['name']: new FormControl('', [Validators.required]),
    });
    console.log('🚀 ~ AddVaritantProductFormComponent ~ setVariantsForm ~ this.variantsForm:', this.variantsForm);
  }

  onFileChange(event: any, variant: FormGroup, controlName: string) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file || !this.isValidImageFile(file)) return;

    this.readAndSetImage(file, variant, controlName);
  }

  removeFileImage(idx: number, variant: FormGroup, controlName: string): void {
    this.setValueFormGroup(variant, controlName, '');
  }

  private isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    return validTypes.includes(file.type) && file.size <= maxSize;
  }

  private readAndSetImage(file: File, variant: FormGroup, controlName: string): void {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const variantFromControl = variant.controls[controlName] as any;
      variantFromControl.value = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  openSetup() {
    this.formOptionsGroup.controls['isOptionSetup'].value = true;
    this.emitOpenSetupOptionsAndVariants.emit(this._indexComponent);
  }

  removeOption() {
    this.emitDeletion.emit(this._indexComponent);
  }

  removeOptionValue(idx: any) {
    const variantFrom = <FormArray>this.option_values;
    variantFrom.removeAt(idx);
    console.log('🚀 ~ AddVaritantProductFormComponent ~ removeVariant ~ variantFrom:', variantFrom);
  }

  setIsImage() {
    const variantFrom = <FormArray>this.option_values;
    Object.keys(variantFrom.controls).forEach((key: any) => {
      const temp = <FormGroup>variantFrom.controls[key];
      if (!this.isImage) {
        temp.removeControl('image');
      } else {
        temp.addControl('image', new FormControl('', [Validators.required]));
      }
      console.log('🚀 ~ AddVaritantProductFormComponent ~ Object.keys ~ v:', variantFrom.controls[key]);
    });
  }

  getOption(id: any) {
    const options = this.listOfOptions.find((option: any) => option._id == id);
    return options;
  }

  drop(event: CdkDragDrop<object[]>) {
    moveItemInArray(this.option_values.controls, event.previousIndex, event.currentIndex);
  }

  customDuplicateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;

    if (this.duplicates) {
      for (var i = 0; i < this.duplicates.length; i++) {
        let errors: any = (formGroup.controls[this.duplicates[i]].get('name')?.errors as Object) || {};
        delete errors['duplicated'];
        formGroup.controls[this.duplicates[i]].get('name')?.setErrors(errors as ValidationErrors);
      }
    }

    let dict: any = {};
    Object.values(formGroup.controls).forEach((control, idx) => {
      const name = control.get('name')?.value;
      dict[name] = dict[name] || [];
      dict[name].push(idx);
    });
    let duplicates: any[] = [];
    for (var key in dict) {
      if (dict[key].length > 1) duplicates = duplicates.concat(dict[key]);
    }
    for (const index of duplicates) {
      formGroup.controls[index + 1].get('name')?.setErrors({ duplicated: true });
      console.log("🚀 ~ AddVaritantProductFormComponent ~ +index:", +index)
    }
    console.log('🚀 ~ AddVaritantProductFormComponent ~ dict:', dict);
    console.log('🚀 ~ AddVaritantProductFormComponent ~ duplicates:', duplicates);
    console.log('🚀 ~ AddVaritantProductFormComponent ~ formGroup:', formGroup);

    if (duplicates.length <= 0) {
      return null;
    } else {
      return { optionValueDuplicated: true };
    }
  };

}
