import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef, } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { UtilsService } from 'src/app/base/utils.sevice';
import { OptionsProductForm } from 'src/app/modules/management/model/options-product-form';
import { AddVaritantProductFormComponent } from '../../component/add-varitant-product-form/add-varitant-product-form.component';
import { v4 as uuid } from 'uuid';
import { ProductsService } from '../../../service/products.service';
import { Product2Create, ProductOption } from 'src/app/modules/management/model/product.model';
import * as _ from 'lodash';
import { Utils } from 'src/app/shared/utils/utils';
import { MatDialog } from '@angular/material/dialog';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  product: Product2Create = new Product2Create();

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
    private utils: Utils,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = new FormGroup({});
  }

  ngOnInit() {
    this.initProduct();
  }


  private initProduct() {
    let id = this.route.snapshot.params["id"]
    //Logic handle create new or edit product with state and id
    const getCurrentNavigation = this.router.getCurrentNavigation();
    const data = getCurrentNavigation?.extras.state;
    if (data && data['product']) {
      this.product = data['product'];
      this.initForm();
      this.initializeProductImages();
    } else if (id) {
      this.productsService.getProductById(id).subscribe((product: Product2Create) => {
        if (product) {
          this.product = product;
          console.log("🚀 ~ ProductDetailComponent ~ this.productsService.getProductById ~  this.product:", this.product)
        }
        this.initForm();
        this.initializeProductImages();
      });
    } else {
      this.initForm();
      this.initializeProductImages();
    }
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
    this.productForm.controls['productVariants'] = await this.processVariantsForm();
    this.initOptions();
  }
  // Initialize product images
  private initializeProductImages() {
    this.productMainImage = this.createImageData(
      'Tải lên ảnh chỉnh',
      this.product.mainImage,
      'assets/icons/heroicons/outline/media-image.svg',
      false,
      ['Kích thước: 300x300 px', 'Kích thước tập tin tối đa: 5MB', 'Format: JPG, JPEG, PNG']
    )

    this.initializeProductGallery();
  }

  initializeProductGallery() {
    const galleryConfig: [string, string, boolean][] = [
      ['Chính Diện', './assets/images/front.png', true],
      ['Cạnh Bên', './assets/images/side.png', true],
      ['Góc Độ Khác', './assets/images/another-angle.png', true],
      ['Đang sử dụng', './assets/images/using.png', true],
      ['Biến Thể', './assets/images/variant.png', true],
      ['Cảnh nền', './assets/images/background-perspective.png', true],
      ['Chụp cận', './assets/images/close-up-photo.png', true],
      ['Kích Thước', './assets/images/size-box.png', true]
    ];

    this.productGalleryImages = galleryConfig.map((config, index) =>
      this.createImageData(config[0], this.product.galleryImage[index] || '', config[1], config[2])
    );

    if (this.product.galleryImage.length > 0) {
      this.enableNextImageSlot(this.product.galleryImage.length - 1);
    }
  }


  private createImageData(name: string, value: string, icon: string, disable: boolean, attrs?: Array<String>) {
    return { name, value: value, icon, disable: disable, attrs };
  }

  onSubmit() {
    if (!this.productForm.valid || this.isAnyOptionSetup()) {
      this.markFormGroupTouched(this.productForm);
      return;
    }

    const productUpsert = this.prepareProductData();
    console.log("🚀 ~ ProductDetailComponent ~ onSubmit ~ productUpsert:", productUpsert)
    // this.createProduct(productUpsert);
    return;
    if (productUpsert.id) {
      this.updateProduct(productUpsert);
    } else {
      this.createProduct(productUpsert);
    }
  }

  // Prepare product data for submission
  private prepareProductData() {
    const formValue = this.productForm.getRawValue();
    const galleryImages = this.productGalleryImages
      .filter((item: any) => item.value)
      .map((item: any) => item.value);

    const options: Array<ProductOption> = [];

    Object.values(formValue.options).forEach((option: any) => {
      options.push(option);
    })

    return {
      id: this.product.id || "",
      name: formValue.productName,
      mainImage: this.productMainImage.value,
      galleryImage: galleryImages,
      cate: formValue.productCate,
      desc: formValue.productDesc,
      options: options,
      //don't know why can not get value option_value of productVariants on formValue;
      variants: this.getFormGroup(this.productForm, 'productVariants').value,
    };
  }

  private createProduct(productUpsert: any) {
    this.productsService.createProduct(productUpsert).subscribe((res: any) => {
      if (res) {
        this.showSuccesCreate()
      }
    })
  }

  private updateProduct(productUpsert: any) {
    this.productsService.updateProduct(productUpsert).subscribe((res: any) => {
      if (res) {
        this.showSuccesCreate()
      }
    })
  }

  showSuccesCreate() {
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
          type: 'success'
        },
        title: 'Tạo Sản Phẩm Thành Công',
        content: 'Bạn có thể chỉnh sửa hoặc quay lại trang danh sách sản phẩm để xem sản phẩm vừa tạo',
        btn: [
          {
            label: 'OK',
            type: 'cancel'
          },
          {
            label: 'Quay lại Danh sách sản phẩm',
            type: 'submit'
          },
        ]
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        window.location.href = '/management/products';
      }
    });
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
      index > currentIndex && !item.value
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


  // Handle drag and drop for gallery images
  drop(event: CdkDragDrop<object[]>) {
    moveItemInArray(this.productGalleryImages, event.previousIndex, event.currentIndex);
  }

  // Toggle options on/off
  toggleOptions() {
    if (this.isOptions) {
      if (!this.product.variants || this.product.variants.length <= 0) {
        this.addOption();
      }
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
    if (!this.product.variants || this.product.variants.length <= 0) {
      return;
    }

    this.isOptions = true;

    this.productForm.addControl('options', this.fb.group({}));
    let optionsForm = this.productForm.controls['options'] as FormGroup;


    //convert product variant to option
    // this.product.variants.forEach((pv: any) => {
    //   pv.option_values.forEach((ov: any) => {
    //     let option = options.find((co: any) => co.option_id == ov.option_id);
    //     if (!option) {
    //       option = {
    //         isOptionSetup: false,
    //         option_id: ov.option_id,
    //         option_values: []
    //       }
    //     }
    //     if (option.option_id == ov.option_id) {
    //       let optionValueExist = option.option_values.find((s: any) => s.option_id == ov.option_id && s.name == ov.name)
    //       if (!optionValueExist) {
    //         option.option_values.push(ov);
    //       }
    //     }
    //     let optionExist = options.find((co: any) => co.option_id == option.option_id);

    //     if (!optionExist) {
    //       options.push(option);
    //     }
    //   })
    // });

    //crate option form
    Object.assign(this.confirmedOptions, this.product.options);


    await this.confirmedOptions.forEach(async (option: any) => {
      const uId = uuid();
      const optionGroup = this.fb.group({
        option_id: [option.option_id, Validators.required],
        option_values: this.fb.array([]),
        isOptionSetup: false,
      });

      const optionValuesArray = optionGroup.get('option_values') as FormArray;

      option.option_values.forEach((ov: any) => {
        const variantForm = this.fb.group({
          name: [ov.name, Validators.required],
        }) as FormGroup;

        if (ov.image) {
          variantForm.addControl('image', this.fb.control(ov.image, Validators.required));
        }

        optionValuesArray.push(variantForm);
      });

      optionsForm.addControl(uId, optionGroup);
      this.addOption(optionsForm, uId);
    });

    this.productForm.removeControl('productVariants');
    this.productForm.addControl('productVariants', this.fb.array([]));
    this.productForm.controls['productVariants'] = await this.processVariantsForm();
    console.log("🚀 ~ ProductDetailComponent ~ initOptions ~ this.productForm.controls['productVariants']:", this.productForm.controls['productVariants'])
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
        uId,
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

    const formOptionsGroup = optionsForm.controls[uId];

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
      const formOptionsGroup = optionsForm.controls[uId];
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
      const formOptionsGroup = optionsForm.controls[uId];
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
      this.productForm.controls['productVariants'] = await this.processVariantsForm();
      if (!this.checkIsOptionsSetup()) {
        this.onChangeVariants();
      }
    });
  }

  evnetEmitOpenSetupOption(ref: any) {
    ref.emitOpenSetupOptionsAndVariants.subscribe(async (uId: any) => {
      let optionsForm = this.productForm.controls['options'] as FormGroup;
      const formOptionsGroup = optionsForm.controls[uId] as FormGroup;

      formOptionsGroup.patchValue({ isOptionSetup: true });

      const option = formOptionsGroup.getRawValue();

      const idxConfirmedOptions = await this.confirmedOptions.findIndex((c: any) => c.option_id == option.option_id);
      this.confirmedOptions[idxConfirmedOptions].option_values = [];
      // this.confirmedOptions.push(option);
      this.productForm.removeControl('productVariants');
      this.productForm.addControl('productVariants', this.fb.array([]));
      this.productForm.controls['productVariants'] = await this.processVariantsForm();
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
    const optionsForm = this.getFormGroup(this.productForm, "options");
    if (!optionsForm)
      return;
    const optionsFormValue = optionsForm.value;
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
  // private async processVariantsForm() {
  //   let sets = [[]];

  //   let variantsForm = this.fb.array([]) as FormArray;

  //   const variantsFromOptions = this.processMapVariantsFromOptions(this.confirmedOptions);

  //   await variantsFromOptions.forEach(async (variantValuesFromOptions: any) => {
  //     let variantExist: any = null;

  //     this.product.variants.forEach(async (productVariant: any) => {
  //       var result = this.isArrayEqual(
  //         variantValuesFromOptions,
  //         productVariant.option_values
  //       );
  //       if (result) {
  //         variantExist = productVariant
  //       }
  //     });

  //     let variantForm = this.fb.group({
  //       ['price']: new FormControl('', [Validators.required]),
  //       ['qty']: new FormControl('', [Validators.required]),
  //       ['upc']: new FormControl(''),
  //     }) as FormGroup;

  //     if (variantExist) {
  //       variantForm.patchValue({ price: variantExist.price });
  //       variantForm.patchValue({ qty: variantExist.qty });
  //       variantForm.patchValue({ upc: variantExist.upc });
  //     }

  //     if (variantValuesFromOptions && variantValuesFromOptions.length > 0) {
  //       variantForm.addControl('option_values', this.fb.array([]));
  //       const optionsValuesForm = variantForm.controls['option_values'] as FormArray;

  //       await variantValuesFromOptions.forEach((s: any) => {
  //         const optionValueForm = this.fb.group({
  //           ['name']: new FormControl(s.name),
  //           ['option_id']: new FormControl(s.option_id),
  //         }) as FormGroup;

  //         optionsValuesForm.push(optionValueForm);
  //       });
  //     }
  //     variantsForm.push(variantForm);
  //   });
  //   return variantsForm;
  // }

  async processVariantsForm(): Promise<FormArray> {
    const variantsFromOptions = this.processMapVariantsFromOptions(this.confirmedOptions);
    const variantsForm = this.fb.array([]) as FormArray;

    await variantsFromOptions.forEach((variantValuesFromOptions: any[]) => {

      const variantExist = this.product.variants.find(productVariant =>
        this.isArrayEqual(variantValuesFromOptions, productVariant.option_values)
      );

      const variantForm = this.fb.group({
        price: [variantExist?.price || '', Validators.required],
        qty: [variantExist?.qty || '', Validators.required],
        upc: [variantExist?.upc || '']
      }) as FormGroup;

      if (variantValuesFromOptions && variantValuesFromOptions.length > 0) {
        const optionsValuesForm = this.fb.array(
          variantValuesFromOptions.map(s => this.fb.group({
            name: [s.name],
            option_id: [s.option_id]
          }))
        );
        variantForm.addControl('option_values', optionsValuesForm);
      }

      variantsForm.push(variantForm);
    });

    return variantsForm;
  }


  processMapVariantsFromOptions(confirmedOptions: any[]): any[][] {
    return confirmedOptions.reduce((sets: any, option: any) => {
      const processedValues = option.option_values.map(({ image, ...rest }: any) => ({
        ...rest,
        option_id: option.option_id
      }));

      return processedValues.length > 0
        ? sets.flatMap((set: any) => processedValues.map((value: any) => [...set, value]))
        : sets;
    }, [[]] as any[][]);
  }

  isArrayEqual(x: any, y: any) {
    return _(x).xorWith(y, _.isEqual).isEmpty();
  };

  // Create variants form
  private async initVariantsForm() {
    let variantsForm = this.fb.array([]) as FormArray;
    await this.product.variants.forEach(async (variant: any) => {
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
        variantsForm.push(variantForm);
      }
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

  async submitBatchEditing() {
    const variantsForm = this.getFormGroup(this.productForm, 'productVariants');

    if (!variantsForm)
      return;
    const variantsFormControls = variantsForm.controls;

    await Object.values(variantsFormControls).forEach((variant: any) => {
      variant.patchValue({ price: this.batchEditingPrice });
      variant.patchValue({ qty: this.batchEditingQTY });
      variant.patchValue({ upc: this.batchEditingSKU });
    });
    this.onChangeVariants();
  }

  onChangeVariants() {
    const variantsProductForm = this.getFormGroup(this.productForm, 'productVariants');
    if (!variantsProductForm)
      return;
    const variantsProductValue = variantsProductForm.value;
    this.product.variants = variantsProductValue;
  }
}
