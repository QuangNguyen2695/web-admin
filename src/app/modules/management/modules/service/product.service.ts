import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { OptionsProductForm } from "../../model/options-product-form";

@Injectable({
    providedIn: 'root',
})
export class ProductService {
    constructor(private fb: FormBuilder) { }

    /**
     * Converts an array of OptionsProductForm objects to a FormGroup.
     * @param optionsProductForm - Array of OptionsProductForm objects to convert.
     * @returns FormGroup representing the product options and their variants.
     */
    // toFormGroup(optionsProductForm: OptionsProductForm<string>[]): FormGroup {
    //     if (!optionsProductForm || optionsProductForm.length === 0) {
    //         return this.fb.group({});
    //     }

    //     const formGroup = this.fb.group({});

    //     optionsProductForm.forEach(option => {
    //         const variantsFormArray = this.fb.array(
    //             option.variants.map(variant =>
    //                 this.fb.group(
    //                     variant.value.reduce((acc: any, field: any) => {
    //                         acc[field.key] = [field.value, field.required ? Validators.required : null];
    //                         return acc;
    //                     }, {})
    //                 )
    //             )
    //         );

    //         formGroup.addControl(option.key, this.fb.array({
    //             [option.key]: ['', Validators.required],
    //             variants: variantsFormArray
    //         }));
    //     });

    //     return formGroup;
    // }
}