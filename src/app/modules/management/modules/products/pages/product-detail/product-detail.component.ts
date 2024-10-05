import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef, } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { UtilsService } from 'src/app/base/utils.sevice';
import { OptionsProductForm } from 'src/app/modules/management/model/options-product-form';
import { AddVaritantProductFormComponent } from '../../component/add-varitant-product-form/add-varitant-product-form.component';
import { v4 as uuid } from 'uuid';
import { ProductService } from '../../../service/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
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
    private productService: ProductService,
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
    const galleryImages = this.productGalleryImages
      .filter((item: any) => item.value)
      .map((item: any) => item.value);

    return {
      name: formValue.productName,
      mainImage: this.productMainImage.value,
      galleryImage: galleryImages,
      cate: formValue.productCate,
      desc: formValue.productDesc,
      variants: formValue.productVariants,
    };
  }

  private uploadImageToFBStorage(productUpsert: any) {
    this.productService.uploadImageToFBStorage(productUpsert.id, productUpsert.mainImage);
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
      if (index + 1 < this.productGalleryImages.length) {
        const nextImage = this.productGalleryImages[index + 1];
        nextImage.disable = false;
      }
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
  private initForm() {
    this.productForm = this.fb.group({
      productName: ['', [Validators.required, Validators.minLength(25)]],
      productMainImage: ['', Validators.required],
      productCate: ['', Validators.required],
      productDesc: ['', Validators.required],
      productVariants: this.createVariantsForm(),
    });
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
      'assets/icons/heroicons/outline/media-image.svg',
      false,
      ['Kích thước: 300x300 px', 'Kích thước tập tin tối đa: 5MB', 'Format: JPG, JPEG, PNG']
    )

    this.productGalleryImages = [
      this.createImageData('Chính Diện', './assets/images/front.png', true),
      this.createImageData('Cạnh Bên', './assets/images/side.png', true),
      this.createImageData('Góc Độ Khác', './assets/images/another-angle.png', true),
      this.createImageData('Đang sử dụng', './assets/images/using.png', true),
      this.createImageData('Biến Thể', './assets/images/variant.png', true),
      this.createImageData('Cảnh nền', './assets/images/background-perspective.png', true),
      this.createImageData('Chụp cận', './assets/images/close-up-photo.png', true),
      this.createImageData('Kích Thước', './assets/images/size-box.png', true)
    ];
  }

  private createImageData(name: string, icon: string, disable: boolean, attrs?: Array<String>) {
    return { name, value: null, icon, disable: disable, attrs };
  }

  // Handle drag and drop for gallery images
  drop(event: CdkDragDrop<object[]>) {
    moveItemInArray(this.productGalleryImages, event.previousIndex, event.currentIndex);
  }

  // Toggle options on/off
  toggleOptions() {
    if (this.isOptions) {
      this.addOption();
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

  // Add a new option
  addOption() {
    let optionsForm = this.productForm.controls['options'] as FormGroup;

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(AddVaritantProductFormComponent);
    let componentRef = this.optionsContainer.createComponent(componentFactory);

    let ref: any = componentRef.instance;

    const uId = uuid();

    if (!optionsForm) {
      this.productForm.addControl('options', this.fb.group({}));
      optionsForm = this.productForm.controls['options'] as FormGroup;
      optionsForm.setValidators(this.customOptionsValidator);
    }

    optionsForm.addControl(
      'option-' + uId,
      this.fb.group({
        option_id: ['', Validators.required],
        option_values: this.fb.array([]),
        isOptionSetup: true,
      }),
    );

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
    ref.emitOptionsAndVariants.subscribe((uId: any) => {
      let optionsForm = this.productForm.controls['options'] as FormGroup;
      const formOptionsGroup = optionsForm.controls['option-' + uId];
      const option = formOptionsGroup.getRawValue();

      //check isValidNewAddOptions
      this.checkIsValidNewAddOptions(option);

      const existConfirmedOptions = this.confirmedOptions.find((c: any) => c.option_id == option.option_id);
      if (existConfirmedOptions) {
        existConfirmedOptions.option_values = option.option_values;
      } else {
        this.confirmedOptions.push(option);
      }
      this.productForm.removeControl('productVariants');
      this.productForm.addControl('productVariants', this.createVariantsForm());
      console.log('🚀 ~ ProductDetailComponent ~ addOption ~ this.productForm: 1111111111', this.productForm);
    });
  }

  evnetEmitOpenSetupOption(ref: any) {
    ref.emitOpenSetupOptionsAndVariants.subscribe((uId: any) => {
      let optionsForm = this.productForm.controls['options'] as FormGroup;
      const formOptionsGroup = optionsForm.controls['option-' + uId];
      const option = formOptionsGroup.getRawValue();

      const idxConfirmedOptions = this.confirmedOptions.findIndex((c: any) => c.option_id == option.option_id);
      this.confirmedOptions[idxConfirmedOptions].option_values = [];
      // this.confirmedOptions.push(option);
      this.productForm.removeControl('productVariants');
      this.productForm.addControl('productVariants', this.createVariantsForm());
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

  getFormGroup(formControl: FormGroup, controlName: string) {
    const formGroup = formControl.controls[controlName] as any;
    if (formGroup && !formGroup) return '';
    return formGroup;
  }

  // Create variants form
  private createVariantsForm() {
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

    sets.forEach((set: any) => {
      const variantForm = this.fb.group({
        ['price']: new FormControl('', [Validators.required]),
        ['qty']: new FormControl('', [Validators.required]),
        ['upc']: new FormControl(''),
        ['option_values']: new Array(),
      });
      const option_values: any = variantForm.controls['option_values'];
      option_values.value = [];
      set.forEach((s: any) => {
        option_values.value.push(s);
      });

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
    console.log('🚀 ~ ProductDetailComponent ~ submitBatchEditing ~ variantsForm:', variantsForm);
    Object.values(variantsForm).forEach((variant: any) => {
      variant.patchValue({ price: this.batchEditingPrice });
      variant.patchValue({ qty: this.batchEditingQTY });
      variant.patchValue({ upc: this.batchEditingSKU });
    });
  }
}
