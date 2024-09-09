import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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

  variants: any;

  idxVariant = 0;

  listOfOptions = [
    {
      name: 'Màu Sắc',
      value: 'mausac',
    },
    {
      name: 'Size',
      value: 'size',
    },
  ];

  isSetupOptions: boolean = true;

  _indexComponent: number | undefined;

  @Output() emitDeletion = new EventEmitter<number>()

  constructor(private fb: FormBuilder) { }

  init(index: number, formOptionsGroup: any, isFixedForm: boolean) {
    this._indexComponent = index;
    this.formOptionsGroup = formOptionsGroup;
    this.isFixedForm = isFixedForm;
  }

  ngOnInit() {
    this.setVariantsForm();
    this.variants = this.formOptionsGroup.controls['variants'] as FormArray;
    this.variants.push(this.variantsForm);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onSubmit() {
    const variantFrom = <FormGroup>this.variants;
    console.log("🚀 ~ AddVaritantProductFormComponent ~ onSubmit ~ variantFrom:", variantFrom)
    if (!variantFrom.valid || !this.formOptionsGroup.valid) {
      this.markFormGroupTouched(variantFrom);
      this.markFormGroupTouched(this.formOptionsGroup);
      return;
    }
    this.isSetupOptions = false;
    this.payLoad = JSON.stringify(this.formOptionsGroup.getRawValue());
  }

  getValidityFormGroup(i: any, variant: FormGroup, controlName: string) {
    const variantFromControl = variant.controls[controlName + i] as any;
    const errorsVariantFromControl = variantFromControl;
    return errorsVariantFromControl;
  }

  getValueFormGroup(i: any, variant: FormGroup, controlName: string) {
    const variantFromControl = variant.controls[controlName + i] as any;
    if (!variantFromControl.value) return '';
    return variantFromControl.value;
  }

  setValueFormGroup(i: any, variant: FormGroup, controlName: string, value: any) {
    const variantFromControl = variant.controls[controlName + i] as any;
    if (!variantFromControl.value) return;
    variantFromControl.value = value;
  }

  addVariant() {
    const variantFrom = <FormGroup>this.variants;
    if (!variantFrom.valid) {
      return;
    }
    this.idxVariant += 1;
    this.setVariantsForm();
    this.variants.push(this.variantsForm);
  }

  setVariantsForm() {
    if (this.isImage) {
      this.variantsForm = this.fb.group({
        ['image' + this.idxVariant]: new FormControl('', [Validators.required]),
        ['name' + this.idxVariant]: new FormControl('', [Validators.required]),
      });
      return;
    }
    this.variantsForm = this.fb.group({
      ['name' + this.idxVariant]: new FormControl('', [Validators.required]),
    });
  }

  onFileChange(event: any, variant: FormGroup, controlName: string) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file || !this.isValidImageFile(file)) return;

    this.readAndSetImage(file, variant, controlName);
  }

  removeFileImage(idx: number, variant: FormGroup, controlName: string): void {
    this.setValueFormGroup(idx, variant, controlName, '');
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
    this.isSetupOptions = true;
  }

  remove() {
    this.emitDeletion.emit(this._indexComponent)
  }
}
