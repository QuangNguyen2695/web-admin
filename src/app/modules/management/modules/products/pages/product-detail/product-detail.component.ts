import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef, } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { UtilsService } from 'src/app/base/utils.sevice';
import { OptionsProductForm } from 'src/app/modules/management/model/options-product-form';
import { AddVaritantProductFormComponent } from '../../component/add-varitant-product-form/add-varitant-product-form.component';
import { v4 as uuid } from 'uuid';
import { ProductsService } from '../../../service/products.service';
import { Product2Create } from 'src/app/modules/management/model/product.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  @Input() product: Product2Create = {
    name: "Aó khoác hoodie màu đen siêu phẩm",
    cate: "asdf25asdf43436xsza",
    desc: "<font face=\"Arial\">A&#243; kho&#225;c hoodie m&#224;u &#273;en si&#234;u ph&#7849;m</font>",
    mainImage: "https://storage.googleapis.com/productshowing-708f8.appspot.com/products/1000000016/mainImage/0.jpg?GoogleAccessId=firebase-adminsdk-fe0qg%40productshowing-708f8.iam.gserviceaccount.com&Expires=16446992400&Signature=R8y3O%2FVjUv%2FU1p7ko7o3UnOhNlWO3J7Bd1KnGVWuF7mn%2BZujhm3kgI8Qx%2BqK2YAsBx1C4ntNlPMoUGH1oPtmNLT9nYxFOExZ56Gmij%2BaL6JqBt%2FszIROiQFb4Oyj5a%2BdKWyAp7DIx7hkquwEufjJz7IvSY%2FWUc4%2F9Lw7LwOGLuGCs8OXNZL6Ydab7fFmJbfZzJ%2FGRQjOhCSRRGHMfve49Jthr%2F4N%2BKkiW9AwoekDAMx6BcXBZdekPfGfZH7eoUomcbsFUFbh5fRFTiVsOUceFfHX5COXJEMW2riNwqNb62spL%2Fuq804DsMUaLlkHOuqTjjFghwPJI90HbgteommhFQ%3D%3D",
    galleryImage: [
      "https://storage.googleapis.com/productshowing-708f8.appspot.com/products/1000000016/galleryImage/0.jpg?GoogleAccessId=firebase-adminsdk-fe0qg%40productshowing-708f8.iam.gserviceaccount.com&Expires=16446992400&Signature=Zs9TabS56X%2F1UYH9lb6q%2FUrn3QWdyKI17Rzq%2BIWXRurC3s6AuQYtkX24t2B1CMsvSp2E3eusA%2FWdWiy8lY2H6DbFhGc6mB51W3sGncBz9D2tM1m0cwU7BewqoExfOwTuU%2F2y1GinY1PJn6tNFpOYGcFK6e%2Fq2hu9qqy%2FV2CpUelomKrWxOH3%2BGJyRG6Xo3w6KX4Ti5PeydFArCKx8OqlLVYKIp2RkThpi%2FO7IMOLwry3btnDnPCV8tWVSBM94bFSnhZ3m%2Fl450mbSrvMF%2FvHeNPhEKnz2SgD1s0lVv9VULrmf4xk6I2Da8UcXo6%2FfsdKCIxEy5ZwFBLg%2Bl4ho1bvuA%3D%3D",
      "https://storage.googleapis.com/productshowing-708f8.appspot.com/products/1000000016/mainImage/0.jpg?GoogleAccessId=firebase-adminsdk-fe0qg%40productshowing-708f8.iam.gserviceaccount.com&Expires=16446992400&Signature=R8y3O%2FVjUv%2FU1p7ko7o3UnOhNlWO3J7Bd1KnGVWuF7mn%2BZujhm3kgI8Qx%2BqK2YAsBx1C4ntNlPMoUGH1oPtmNLT9nYxFOExZ56Gmij%2BaL6JqBt%2FszIROiQFb4Oyj5a%2BdKWyAp7DIx7hkquwEufjJz7IvSY%2FWUc4%2F9Lw7LwOGLuGCs8OXNZL6Ydab7fFmJbfZzJ%2FGRQjOhCSRRGHMfve49Jthr%2F4N%2BKkiW9AwoekDAMx6BcXBZdekPfGfZH7eoUomcbsFUFbh5fRFTiVsOUceFfHX5COXJEMW2riNwqNb62spL%2Fuq804DsMUaLlkHOuqTjjFghwPJI90HbgteommhFQ%3D%3D"
    ],
    variants: [
      {
        upc: "11843021",
        price: "10",
        qty: 10,
        option_values: [
          {
            image: "https://storage.googleapis.com/productshowing-708f8.appspot.com/products/1000000016/variants/11843021/0.jpg?GoogleAccessId=firebase-adminsdk-fe0qg%40productshowing-708f8.iam.gserviceaccount.com&Expires=16446992400&Signature=j8EY4MG2UWtSOdyEU%2F3SvOYPwKPHtepFgdkc6U8YtbP0U%2FJa93XSqQQMGncuscS9Smd5bgaSzHJwb6vR6ggJ9PkOhsosr5wTnzhjj6EuSDKjA6kDFwzu%2BGHQaDixJD%2Fi7YvTiZjDrscdKES%2FBAUg02HGLHqNM82h%2F3YS%2BHS5IJG50qjLqWwW0IIFh2CCZj6fsmXz0UIrFigRo%2FbpM831Y4ncD0%2BVrrriWNnfZ8PpJejVfeCaEbfJ%2FiI%2Fw22%2BQUG%2FG6vh0q%2FnTb%2BS6EjzGwgNkDbePQXg8Izm0P2LsUSx6P9KmlhV%2F3NcMW%2B4nx5yOpoi5C89wZn3iLym9Qbn9BB7Vg%3D%3D",
            name: "Đen",
            option_id: "5e70047aa2f3c2574a27e4a2"
          },
          {
            name: "M",
            option_id: "5e70047aa2f3c2574a27e4a3"
          }
        ]
      },
      {
        "upc": "11843022",
        "price": "10",
        "qty": 10,
        "option_values": [
          {
            image: "https://storage.googleapis.com/productshowing-708f8.appspot.com/products/1000000016/variants/18400374/0.jpg?GoogleAccessId=firebase-adminsdk-fe0qg%40productshowing-708f8.iam.gserviceaccount.com&Expires=16446992400&Signature=E95X4Dw4wp6aHVBrpCl2%2BqeOIx2U7ebMgeh8OA8qEGDpichahcY6mFvl8iXAGiUs8rwYwyM84aO1I3wsOtZ1iUBmfED2lKoKzcIQuHRx4YOlqAdcznIg%2FCrt2LVwKrEaXvyBaMGxFbGohY9YXKnXS5atQwkBTYZyeH%2FXW2JDVY3gU50Gp8oyvc2UQ4kuK3UWdKObAva8Nm59E9njqSvsGxck%2BM09IgiwEZxNIDliuCNy01LYHxerKbJ32L0wf18CbC3U5RBRKyp3Yuo1tZi4SwSVEpwNR3r20ch9ZoKjNY71TDXKO7I4HkIj67guxtQpjwBF2WPj2KUmvWuECdd1cQ%3D%3D",
            name: "Xam",
            "option_id": "5e70047aa2f3c2574a27e4a2"
          },
          {
            name: "M",
            "option_id": "5e70047aa2f3c2574a27e4a3"
          }
        ]
      },
      {
        "upc": "11843023",
        "price": "10",
        "qty": 10,
        "option_values": [
          {
            image: "https://storage.googleapis.com/productshowing-708f8.appspot.com/products/1000000016/variants/11843021/0.jpg?GoogleAccessId=firebase-adminsdk-fe0qg%40productshowing-708f8.iam.gserviceaccount.com&Expires=16446992400&Signature=j8EY4MG2UWtSOdyEU%2F3SvOYPwKPHtepFgdkc6U8YtbP0U%2FJa93XSqQQMGncuscS9Smd5bgaSzHJwb6vR6ggJ9PkOhsosr5wTnzhjj6EuSDKjA6kDFwzu%2BGHQaDixJD%2Fi7YvTiZjDrscdKES%2FBAUg02HGLHqNM82h%2F3YS%2BHS5IJG50qjLqWwW0IIFh2CCZj6fsmXz0UIrFigRo%2FbpM831Y4ncD0%2BVrrriWNnfZ8PpJejVfeCaEbfJ%2FiI%2Fw22%2BQUG%2FG6vh0q%2FnTb%2BS6EjzGwgNkDbePQXg8Izm0P2LsUSx6P9KmlhV%2F3NcMW%2B4nx5yOpoi5C89wZn3iLym9Qbn9BB7Vg%3D%3D",
            name: "Đen",
            option_id: "5e70047aa2f3c2574a27e4a2"
          },
          {
            name: "L",
            option_id: "5e70047aa2f3c2574a27e4a3"
          }
        ]
      },
      {
        "upc": "11843024",
        "price": "10",
        "qty": 10,
        "option_values": [
          {
            image: "https://storage.googleapis.com/productshowing-708f8.appspot.com/products/1000000016/variants/18400374/0.jpg?GoogleAccessId=firebase-adminsdk-fe0qg%40productshowing-708f8.iam.gserviceaccount.com&Expires=16446992400&Signature=E95X4Dw4wp6aHVBrpCl2%2BqeOIx2U7ebMgeh8OA8qEGDpichahcY6mFvl8iXAGiUs8rwYwyM84aO1I3wsOtZ1iUBmfED2lKoKzcIQuHRx4YOlqAdcznIg%2FCrt2LVwKrEaXvyBaMGxFbGohY9YXKnXS5atQwkBTYZyeH%2FXW2JDVY3gU50Gp8oyvc2UQ4kuK3UWdKObAva8Nm59E9njqSvsGxck%2BM09IgiwEZxNIDliuCNy01LYHxerKbJ32L0wf18CbC3U5RBRKyp3Yuo1tZi4SwSVEpwNR3r20ch9ZoKjNY71TDXKO7I4HkIj67guxtQpjwBF2WPj2KUmvWuECdd1cQ%3D%3D",
            name: "Xam",
            option_id: "5e70047aa2f3c2574a27e4a2"
          },
          {
            name: "L",
            option_id: "5e70047aa2f3c2574a27e4a3"
          }
        ]
      }
    ]
  }

  @ViewChild('optionsContainer', { read: ViewContainerRef, static: true })

  optionsContainer!: ViewContainerRef;


  loadedOptions: any = {};

  confirmedOptions: any = [];

  productForm: FormGroup;

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '32rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [['bold']],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
  };

  productGalleryImages: any;
  productMainImage: any;

  listOfCategory = [
    {
      name: 'Hàng dệt & Đồ nội thất mềm - Chăn ga gối đệm - Chăn',
      value: 'asdf25asdf43436xsza',
    },
    {
      name: 'Hạng mục khác...',
      value: 'dsfyub345sad2f32432',
    },
  ];

  isOptions = false;
  isValidNewAddOptions = false;

  listOfOptions = [
    {
      display_name: 'Màu Sắc',
      _id: '5e70047aa2f3c2574a27e4a2',
      isSelected: false,
    },
    {
      display_name: 'Size',
      _id: '5e70047aa2f3c2574a27e4a3',
      isSelected: false,
    },
  ];

  optionsProductForm: OptionsProductForm<string>[] = [];

  productVariantsForm: any;

  isTouchedForm = false;

  isBatchEditing = false;

  batchEditingPrice: any;
  batchEditingQTY: any;
  batchEditingSKU: any;

  constructor(
    private fb: FormBuilder,
    public utilsService: UtilsService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private productsService: ProductsService,
  ) {
    this.productForm = new FormGroup({});
  }

  ngOnInit() {
    this.initForm();
    this.initProductImages();
  }

  onSubmit() {
    if (!this.productForm.valid || this.isAnyOptionSetup()) {
      this.markFormGroupTouched(this.productForm);
      return;
    }

    const productUpsert = this.prepareProductData();
    console.log("🚀 ~ ProductDetailComponent ~ onSubmit ~ productUpsert:", productUpsert)
  }

  // Prepare product data for submission
  private prepareProductData() {
    const formValue = this.productForm.getRawValue();
    console.log("🚀 ~ ProductDetailComponent ~ prepareProductData ~ this.productForm:", this.productForm)
    console.log("🚀 ~ ProductDetailComponent ~ prepareProductData ~ formValue:", formValue)
    const galleryImages = this.productGalleryImages
      .filter((item: any) => item.value)
      .map((item: any) => item.value);

    return {
      name: formValue.productName,
      mainImage: this.productMainImage.value,
      galleryImage: galleryImages,
      cate: formValue.productCate,
      desc: formValue.productDesc,
      //don't know why can not get value option_value of productVariants on formValue;
      variants: this.getFormGroup(this.productForm, 'productVariants').value,
    };
  }

  private createProduct(productUpsert: any) {
    this.productsService.createProduct(productUpsert)
  }

  // Handle file change for gallery images
  onFileChange(event: any, currentImageIndex: number) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length && currentImageIndex < this.productGalleryImages.length; i++) {
      const file = files[i];
      if (!file || !this.isValidImageFile(file)) continue;

      this.readAndSetImage(file, currentImageIndex);
      currentImageIndex++;
    }
    // Update form control
    this.productForm.patchValue({ productImage: 'Have image' });
  }

  onMainImageFileChange(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file && this.isValidImageFile(file)) {
      this.readAndSetMainImage(file);
    }
  }

  private readAndSetMainImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.productMainImage.value = event.target.result;
      this.productMainImage.disable = true;
      this.enableNextImageSlot(-1);
    };
    reader.readAsDataURL(file);
  }

  // Enable next image slot if available
  private enableNextImageSlot(currentIndex: number): void {
    const nextImage = this.productGalleryImages.find((item: any, index: number) =>
      index > currentIndex && item.value == null
    );
    if (nextImage) {
      nextImage.disable = false;
    }
  }

  private isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    return validTypes.includes(file.type) && file.size <= maxSize;
  }

  private readAndSetImage(file: File, index: number): void {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const currentImage = this.productGalleryImages[index];
      currentImage.value = event.target.result;
      currentImage.disable = true;

      // Enable next image slot if available
      this.enableNextImageSlot(index);
    };
    reader.readAsDataURL(file);
  }

  removeFileImage(currentImageIndex: number): void {
    // Clear the current image
    this.clearImage(currentImageIndex);

    // Shift remaining images to fill the gap
    this.shiftImagesUp(currentImageIndex);

    // Update the disabled state of all images
    this.updateImageStates();
    this.productForm.patchValue({ productImage: '' });
  }

  // Remove main image
  removeMainImageFileImage(): void {
    this.productMainImage.value = null;
    this.productMainImage.disable = false;
    this.updateImageStates();
    this.productForm.patchValue({ productMainImage: '' });
  }

  // Clear image at specific index
  private clearImage(index: number): void {
    this.productGalleryImages[index].value = null;
    this.productGalleryImages[index].disable = false;
  }

  // Shift images up to fill the gap
  private shiftImagesUp(startIndex: number): void {
    for (let i = startIndex; i < this.productGalleryImages.length - 1; i++) {
      if (this.productGalleryImages[i].value === null && this.productGalleryImages[i + 1].value !== null) {
        this.productGalleryImages[i].value = this.productGalleryImages[i + 1].value;
        this.productGalleryImages[i + 1].value = null;
        this.productGalleryImages[i].disable = true;
      }
    }
  }

  // Update image states after removal
  private updateImageStates(): void {
    let firstEmptySlotFound = false;
    this.productGalleryImages.forEach((image: any) => {
      if (!image.value && !firstEmptySlotFound) {
        image.disable = false;
        firstEmptySlotFound = true;
      } else {
        image.disable = true;
      }
    });
  }

  // Mark all controls in a form group as touched
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Initialize the main form
  private async initForm() {
    this.productForm = this.fb.group({
      productName: [this.product.name, [Validators.required, Validators.minLength(25)]],
      productMainImage: [this.product.mainImage, Validators.required],
      productCate: [this.product.cate, Validators.required],
      productDesc: [this.product.desc, Validators.required],
      productVariants: this.fb.array([]),
    });
    this.productForm.controls['productVariants'] = await this.createVariantsForm();
    this.initOptions();
  }

  variantFormBuilder() {
    return this.fb.group({
      ['price']: new FormControl('', [Validators.required]),
      ['qty']: new FormControl('', [Validators.required]),
      ['upc']: new FormControl(''),
    });
  }

  // Initialize product images
  private initProductImages() {
    this.productMainImage = this.createImageData(
      'Tải lên ảnh chỉnh',
      this.product.mainImage,
      'assets/icons/heroicons/outline/media-image.svg',
      false,
      ['Kích thước: 300x300 px', 'Kích thước tập tin tối đa: 5MB', 'Format: JPG, JPEG, PNG']
    )

    this.productGalleryImages = [
      this.createImageData('Chính Diện', this.product.galleryImage[0], './assets/images/front.png', true),
      this.createImageData('Cạnh Bên', this.product.galleryImage[1], './assets/images/side.png', true),
      this.createImageData('Góc Độ Khác', this.product.galleryImage[2], './assets/images/another-angle.png', true),
      this.createImageData('Đang sử dụng', this.product.galleryImage[3], './assets/images/using.png', true),
      this.createImageData('Biến Thể', this.product.galleryImage[4], './assets/images/variant.png', true),
      this.createImageData('Cảnh nền', this.product.galleryImage[5], './assets/images/background-perspective.png', true),
      this.createImageData('Chụp cận', this.product.galleryImage[6], './assets/images/close-up-photo.png', true),
      this.createImageData('Kích Thước', this.product.galleryImage[7], './assets/images/size-box.png', true)
    ];
    this.enableNextImageSlot(this.product.galleryImage.length - 1);
  }

  private createImageData(name: string, value: string, icon: string, disable: boolean, attrs?: Array<String>) {
    return { name, value: value, icon, disable: disable, attrs };
  }

  // Handle drag and drop for gallery images
  drop(event: CdkDragDrop<object[]>) {
    moveItemInArray(this.productGalleryImages, event.previousIndex, event.currentIndex);
  }

  // Toggle options on/off
  toggleOptions() {
    if (this.isOptions) {
      this.initOptions();
    } else {
      this.turnOffOptions();
    }
  }

  // Turn off options
  turnOffOptions() {
    const optionsForm = this.productForm.get('options') as FormGroup;
    if (optionsForm) {
      this.productForm.removeControl('options');
    }

    for (let idx in this.loadedOptions) {
      this.loadedOptions[idx].destroy();
    }
    this.loadedOptions = {};
    this.isOptions = false;
    return;
  }

  async initOptions() {
    if (this.product.variants && this.product.variants.length < 0) {
      return;
    }

    this.isOptions = true;

    this.productForm.addControl('options', this.fb.group({}));
    let optionsForm = this.productForm.controls['options'] as FormGroup;

    let options: any = [];

    //convert product variant to option
    this.product.variants.forEach((pv: any) => {
      pv.option_values.forEach((ov: any) => {
        let option = options.find((co: any) => co.option_id == ov.option_id);
        if (!option) {
          option = {
            isOptionSetup: false,
            option_id: ov.option_id,
            option_values: []
          }
        }
        if (option.option_id == ov.option_id) {
          let optionValueExist = option.option_values.find((s: any) => s.option_id == ov.option_id && s.name == ov.name)
          if (!optionValueExist) {
            option.option_values.push(ov);
          }
        }
        let optionExist = options.find((co: any) => co.option_id == option.option_id);

        if (!optionExist) {
          options.push(option);
        }
      })
    });
    console.log("🚀 ~ ProductDetailComponent ~ pv.option_values.forEach ~ options:", options)

    //crate option form
    await options.forEach(async (o: any) => {
      const uId = uuid();
      optionsForm.addControl('option-' + uId, this.fb.group({
        option_id: [o.option_id, Validators.required],
        option_values: this.fb.array([]),
        isOptionSetup: false,
      }));

      await o.option_values.forEach((ov: any) => {
        const variantsForm = this.fb.group({
          ['name']: new FormControl(ov.name, [Validators.required]),
        }) as FormGroup;

        if (ov.image) {
          variantsForm.addControl('image', new FormControl(ov.image, [Validators.required]));
        }
        const optionForm = optionsForm.controls['option-' + uId] as FormGroup;
        const option_values = optionForm.controls['option_values'] as FormArray;
        option_values.push(variantsForm);
      });

      this.addOption(optionsForm, uId);
    });

    Object.assign(this.confirmedOptions, options);
    console.log("🚀 ~ ProductDetailComponent ~ initOptions ~ this.confirmedOptions:", this.confirmedOptions)
    this.productForm.removeControl('productVariants');
    this.productForm.addControl('productVariants', this.fb.array([]));
    this.productForm.controls['productVariants'] = await this.initVariantsForm();
    console.log("🚀 ~ ProductDetailComponent ~ initOptions ~ this.productForm:", this.productForm)
  }

  // Add a new option
  addOption(optionsForm?: FormGroup, uId?: string) {

    //create new uId
    if (!uId) {
      uId = uuid();
    }

    //create new optionsForm
    if (!optionsForm) {
      this.productForm.addControl('options', this.fb.group({}));
      optionsForm = this.productForm.controls['options'] as FormGroup;
      optionsForm.setValidators(this.customOptionsValidator);

      optionsForm.addControl(
        'option-' + uId,
        this.fb.group({
          option_id: ['', Validators.required],
          option_values: this.fb.array([]),
          isOptionSetup: true,
        }),
      );
    }

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(AddVaritantProductFormComponent);
    let componentRef = this.optionsContainer.createComponent(componentFactory);

    let ref: any = componentRef.instance;

    const formOptionsGroup = optionsForm.controls['option-' + uId];

    formOptionsGroup.setValidators(this.customOptionValidator);

    const countLoadedOptions = Object.getOwnPropertyNames(this.loadedOptions).length;

    const isFixedForm = countLoadedOptions <= 0;

    ref.init(uId, formOptionsGroup, isFixedForm, this.listOfOptions); // Will be used to know which index should be removed

    this.loadedOptions[uId] = componentRef;

    this.eventEmitDeletion(ref);
    this.evnetEmitOptions(ref);
    this.evnetEmitOpenSetupOption(ref);

    this.isValidNewAddOptions = optionsForm?.valid;
  }

  customOptionValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;

    let formGroupValid = false;
    let hasFormGroupInValid = false;

    Object.values(formGroup.controls).forEach((control) => {
      if (!hasFormGroupInValid) {
        formGroupValid = control.valid;
      }
      if (!formGroupValid) {
        hasFormGroupInValid = true;
      }
    });

    if (formGroupValid) {
      return null; // null => valid
    } else {
      return { optionGroupInvalid: true }; // validation errors => not valid
    }
  };

  customOptionsValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;

    let formGroupValid = false;

    Object.values(formGroup.controls).forEach((control) => {
      formGroupValid = control.valid;
    });

    if (formGroupValid) {
      return null; // null => valid
    } else {
      return { optionsGroupInvalid: true }; // validation errors => not valid
    }
  };

  eventEmitDeletion(ref: any) {
    // Subscribing to the EventEmitter from the option
    ref.emitDeletion.subscribe((uId: number) => {
      let optionsForm = this.productForm.controls['options'] as FormGroup;
      const formOptionsGroup = optionsForm.controls['option-' + uId];
      const option = formOptionsGroup.getRawValue();
      this._removeOption(uId);

      this.listOfOptions.forEach((o: any) => {
        if (o._id == option.option_id) {
          o.isSelected = false;
          this.isValidNewAddOptions = true;
        }
      });
    });
  }

  evnetEmitOptions(ref: any) {
    // Subscribing to the EventEmitter from the option
    ref.emitOptionsAndVariants.subscribe(async (uId: any) => {
      let optionsForm = this.productForm.controls['options'] as FormGroup;
      const formOptionsGroup = optionsForm.controls['option-' + uId];
      const option = formOptionsGroup.getRawValue();

      //check isValidNewAddOptions
      this.checkIsValidNewAddOptions(option);

      const existConfirmedOptions = await this.confirmedOptions.find((c: any) => c.option_id == option.option_id);
      if (existConfirmedOptions) {
        existConfirmedOptions.option_values = option.option_values;
      } else {
        this.confirmedOptions.push(option);
      }
      this.productForm.removeControl('productVariants');
      this.productForm.addControl('productVariants', this.fb.array([]));
      this.productForm.controls['productVariants'] = await this.createVariantsForm();
      if(!this.checkIsOptionsSetup()){
        this.onChangeVariants();
      }
    });
    console.log("🚀 ~ ProductDetailComponent ~ ref.emitOptionsAndVariants.subscribe ~  this.productForm:", this.productForm)
  }

  evnetEmitOpenSetupOption(ref: any) {
    ref.emitOpenSetupOptionsAndVariants.subscribe(async (uId: any) => {
      let optionsForm = this.productForm.controls['options'] as FormGroup;
      const formOptionsGroup = optionsForm.controls['option-' + uId] as FormGroup;

      formOptionsGroup.patchValue({ isOptionSetup: true });

      const option = formOptionsGroup.getRawValue();

      const idxConfirmedOptions = await this.confirmedOptions.findIndex((c: any) => c.option_id == option.option_id);
      console.log("🚀 ~ ProductDetailComponent ~ ref.emitOpenSetupOptionsAndVariants.subscribe ~ this.confirmedOptions:", this.confirmedOptions)
      this.confirmedOptions[idxConfirmedOptions].option_values = [];
      // this.confirmedOptions.push(option);
      this.productForm.removeControl('productVariants');
      this.productForm.addControl('productVariants', this.fb.array([]));
      this.productForm.controls['productVariants'] = await this.createVariantsForm();
    });
  }

  checkIsValidNewAddOptions(option: any) {
    this.listOfOptions.forEach((o: any) => {
      if (o._id == option.option_id) {
        o.isSelected = true;
        this.isValidNewAddOptions = false;
      } else {
        this.isValidNewAddOptions = true;
      }
    });
  }

  checkConfirmedOptionsValid() {
    const confirmedOptionsValid = this.confirmedOptions.find((c: any) => c.option_values.length > 0);
    return confirmedOptionsValid ? true : false;
  }

  checkIsOptionsSetup() {
    const optionsFormValue = this.getFormGroup(this.productForm, "options").value;
    let isOptionsSetup = false;
    Object.values(optionsFormValue).forEach((option: any) => {
      if (option.isOptionSetup) {
        isOptionsSetup = true;
      }
    })
    return isOptionsSetup;
  }

  getFormGroup(formControl: FormGroup, controlName: string) {
    const formGroup = formControl.controls[controlName] as any;
    if (formGroup && !formGroup) return '';
    return formGroup;
  }

  // Create variants form
  private async createVariantsForm() {
    let sets = [[]];

    this.confirmedOptions.forEach((option: any) => {
      if (option) {
        const newsets: any = [];
        option.option_values.forEach((v: any) => {
          v.option_id = option.option_id;
          newsets.push(Array.from(sets, (set) => [...set, v]));
        });
        sets = newsets.length > 0 ? newsets.flatMap((set: any) => set) : sets;
      }
    });

    let variantsForm = this.fb.array([]) as FormArray;

    await sets.forEach(async (set: any) => {
      console.log("🚀 ~ ProductDetailComponent ~ awaitsets.forEach ~ set:", set)
      let variantExist: any = {};

      this.product.variants.forEach(async (variant: any) => {
        console.log("🚀 ~ ProductDetailComponent ~ this.product.variants.forEach ~ variant:", variant.option_values)
        var result = this.isArrayEqual(
          set,
          variant.option_values
        );
        if (result) {
          variantExist = variant
        }
        console.log("🚀 ~ ProductDetailComponent ~ awaitsets.forEach ~ result:", result)
      });



      let variantForm = this.fb.group({
        ['price']: new FormControl(variantExist.price, [Validators.required]),
        ['qty']: new FormControl(variantExist.qty, [Validators.required]),
        ['upc']: new FormControl(variantExist.upc)
      }) as FormGroup;
      if (set && set.length > 0) {
        variantForm.addControl('option_values', this.fb.array([]));
        await set.forEach((s: any) => {
          variantForm.controls['option_values'].value.push(s);
        });
        variantsForm.push(variantForm);
      }
    });
    return variantsForm;
  }

  isArrayEqual(x: any, y: any) {
    return _(x).xorWith(y, _.isEqual).isEmpty();
  };

  // Create variants form
  private initVariantsForm() {
    let variantsForm = this.fb.array([]) as FormArray;
    this.product.variants.forEach(async (variant: any) => {
      let variantForm = this.fb.group({
        ['price']: new FormControl(variant.price, [Validators.required]),
        ['qty']: new FormControl(variant.qty, [Validators.required]),
        ['upc']: new FormControl(variant.upc),
        ["option_values"]: this.fb.array([])
      }) as FormGroup;
      if (variant.option_values && variant.option_values.length > 0) {
        const option_values: any = variantForm.controls['option_values'];
        option_values.value = [];
        await variant.option_values.forEach((s: any) => {
          option_values.value.push(s);
        });
      }
      variantsForm.push(variantForm);

    });
    return variantsForm;
  }

  // Check if any option is set up
  private isAnyOptionSetup(): boolean {
    const optionsForm = this.productForm.get('options') as FormGroup;
    return optionsForm ? Object.values(optionsForm.controls).some((control: any) => control.value.isOptionSetup) : false;
  }

  getOption(id: any) {
    const options = this.listOfOptions.find((option: any) => option._id == id);
    return options;
  }

  private _removeOption(uId: number) {
    this.loadedOptions[uId].destroy();
    delete this.loadedOptions[uId];
    this.productForm.removeControl('option' + uId);
    if (this.loadedOptions.length <= 0) {
      this.turnOffOptions();
    }
  }

  toggleBatchEditing() {
    this.isBatchEditing = !this.isBatchEditing;
  }

  submitBatchEditing() {
    const variantsForm = this.getFormGroup(this.productForm, 'productVariants').controls;
    Object.values(variantsForm).forEach((variant: any) => {
      variant.patchValue({ price: this.batchEditingPrice });
      variant.patchValue({ qty: this.batchEditingQTY });
      variant.patchValue({ upc: this.batchEditingSKU });
    });
  }

  onChangeVariants() {
    this.product.variants = this.getFormGroup(this.productForm, 'productVariants').value;
    console.log("🚀 ~ ProductDetailComponent ~ onChangeVariants ~ this.getFormGroup(this.productForm, 'productVariants').value:", this.getFormGroup(this.productForm, 'productVariants').value)
  }
}
