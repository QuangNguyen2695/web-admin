import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OptionsProductForm } from 'src/app/modules/management/model/options-product-form';
import { ProductService } from '../../../service/product.service';
import { CommonModule } from '@angular/common';
import { TooltipComponent } from 'src/app/modules/management/components/tooltip/tooltip.component';

@Component({
  selector: 'app-add-varitant-product-form',
  templateUrl: './add-varitant-product-form.component.html',
  styleUrl: './add-varitant-product-form.component.scss',
})
export class AddVaritantProductFormComponent {
  @Input() formOptionsGroup: any;
  payLoad: any;

  variantsForm: FormGroup = new FormGroup({});

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

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.setVariantsForm();
    console.log('🚀 ~ AddVaritantProductFormComponent ~ ngOnInit ~ this.formOptionsGroup:', this.formOptionsGroup);

    if (this.formOptionsGroup) {
      this.variants = this.formOptionsGroup.controls['variants'] as FormArray;
      console.log('🚀 ~ AddVaritantProductFormComponent ~ ngOnInit ~ this.variants:', this.variants);
      this.variants.push(this.variantsForm);
    }
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
    if (!variantFrom.valid) {
      this.markFormGroupTouched(variantFrom);
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
    this.variantsForm = this.fb.group({
      ['image' + this.idxVariant]: new FormControl('', [Validators.required]),
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

  private isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    return validTypes.includes(file.type) && file.size <= maxSize;
  }

  private readAndSetImage(file: File, variant: FormGroup, controlName: string): void {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      // currentImage.value = event.target.result;
      const variantFromControl = variant.controls[controlName] as any;
      variantFromControl.value = event.target.result;
      console.log('🚀 ~ AddVaritantProductFormComponent ~ readAndSetImage ~ variantFromControl:', variantFromControl);
    };
    reader.readAsDataURL(file);
  }

  openSetup() {
    this.isSetupOptions = true;
  }
}
