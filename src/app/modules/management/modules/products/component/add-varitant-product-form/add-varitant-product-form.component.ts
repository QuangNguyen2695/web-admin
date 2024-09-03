import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OptionsProductForm } from 'src/app/modules/management/model/options-product-form';
import { ProductService } from '../../../service/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-varitant-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-varitant-product-form.component.html',
  styleUrl: './add-varitant-product-form.component.scss'
})
export class AddVaritantProductFormComponent {
  @Input() params: any;
  formOptionsGroup!: FormGroup;
  payLoad: any;

  optionsProductForm: OptionsProductForm<string>[] | null = [];

  variantsForm: FormGroup = new FormGroup({});

  variants: any;

  constructor(private fb: FormBuilder) {

  }

  idxVariant = 0;

  ngOnInit() {
    this.setVariantsForm();

    if (this.params) {
      this.optionsProductForm = this.params.optionsProductForm;
      this.formOptionsGroup = this.params.formOptionsGroup;
      this.variants = this.formOptionsGroup.controls["variants"] as FormArray;
      this.variants.push(this.variantsForm);
    }
    console.log("🚀 ~ AddVaritantProductFormComponent ~ ngOnInit ~ this.formOptionsGroup.controls", this.formOptionsGroup.controls["variants"])
  }
  onSubmit() {
    this.payLoad = JSON.stringify(this.formOptionsGroup.getRawValue());
    console.log("🚀 ~ AddVaritantProductFormComponent ~ ngOnInit ~ this.formOptionsGroup:", this.formOptionsGroup)
  }

  getValidity(i: any, controlName: any) {
    const variantFrom = (<FormGroup>this.variants.controls[i]);
    const variantFromControl = variantFrom.controls[controlName + i];
    return variantFromControl
  }


  addVariant() {
    this.idxVariant += 1;
    this.setVariantsForm();
    this.variants.push(this.variantsForm);
    console.log("🚀 ~ AddVaritantProductFormComponent ~ addVariant ~ variants:", this.variants)
  }


  setVariantsForm() {
    this.variantsForm = this.fb.group({
      ['image' + this.idxVariant]: new FormControl('', [Validators.required]),
      ['name' + this.idxVariant]: new FormControl('', [Validators.required]),
    });
  }

}
