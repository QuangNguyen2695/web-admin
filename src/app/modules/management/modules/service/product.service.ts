import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { uploadString, ref, getStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private firestore: AngularFirestore) {}

  /**
   * Converts an array of OptionsProductForm objects to a FormGroup.
   * @param optionsProductForm - Array of OptionsProductForm objects to convert.
   * @returns FormGroup representing the product options and their variants.
   */

    // watch doc firebase change
    // this.firestore
    //   .collection('options')
    //   .snapshotChanges()
    //   .subscribe((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //       console.log('🚀 ~ ProductService ~ querySnapshot.forEach ~ doc:', doc);
    //     });
    //   });


    createProduct(){
      
    }
}
