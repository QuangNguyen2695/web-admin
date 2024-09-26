import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor() {}

  /**
   * Converts an array of OptionsProductForm objects to a FormGroup.
   * @param optionsProductForm - Array of OptionsProductForm objects to convert.
   * @returns FormGroup representing the product options and their variants.
   */
  uploadImageToFBStorage(productId: string, image: string) {
  
  }
}
