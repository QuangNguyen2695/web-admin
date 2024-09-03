import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { asapScheduler } from 'rxjs';
import { UtilsService } from 'src/app/base/utils.sevice';
import { OptionsProductForm } from 'src/app/modules/management/model/options-product-form';
import { AddVaritantProductFormComponent } from '../../component/add-varitant-product-form/add-varitant-product-form.component';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  @ViewChild('optionsFrom', { read: ViewContainerRef }) optionsFrom: ViewContainerRef | any;

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
      name: "Hàng dệt & Đồ nội thất mềm - Chăn ga gối đệm - Chăn",
      value: "Hàng dệt & Đồ nội thất mềm - Chăn ga gối đệm - Chăn"
    },
    {
      name: "Hạng mục khác...",
      value: "Hạng mục khác..."
    }
  ];

  isOptions = false;


  optionsProductForm: OptionsProductForm<string>[] = [];


  constructor(
    private fb: FormBuilder,
    private utilsService: UtilsService
  ) {
    this.productForm = new FormGroup({});
    console.log("🚀 ~ ProductDetailComponent ~ this.optionsFrom:", this.optionsFrom)

  }

  ngOnInit() {
    this.formBuilder();
    this.productImageBuilder();
  }

  onSubmit() {
    if (!this.productForm.valid) {
      this.markFormGroupTouched(this.productForm);
      return
    }

    let galleryImage: any = [];


    this.productGalleryImages.forEach((item: any) => {
      if (item.value)
        galleryImage.push(item.value);
    });

    const productUpsert = {
      name: this.productForm.get('productName')?.value,
      mainImage: this.productMainImage,
      galleryImage: galleryImage
    }
    console.log("🚀 ~ ProductDetailComponent ~ onSubmit ~ productUpsert:", productUpsert)
  }

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
    this.productForm.patchValue({ productImage: "Have image" });
    console.log("🚀 ~ ProductDetailComponent ~ readAndSetImage ~ this.productForm:", this.productForm)
  }

  onMainImageFileChange(event: any,) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0)
      return;

    const file = files[0];
    if (!file || !this.isValidImageFile(file))
      return;

    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.productMainImage = this.productMainImage;
      this.productMainImage.value = event.target.result;
      this.productMainImage.disable = true;
      // Enable next image slot if available
      const nextImage = this.productGalleryImages.find((item: any) => item.value == null);
      nextImage.disable = false;
    };
    reader.readAsDataURL(file);
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
    this.productForm.patchValue({ productImage: "" });
    console.log("🚀 ~ ProductDetailComponent ~ removeFileImage ~ this.productGalleryImages:", this.productGalleryImages)
  }

  removeMainImageFileImage(): void {
    // Clear the  image
    this.productMainImage.value = null;
    this.productMainImage.disable = false;

    const nextImage = this.productGalleryImages.find((item: any) => item.disable == false);
    if (!nextImage.value) {
      nextImage.disable = true;
    }

    this.productForm.patchValue({ productMainImage: "" });
  }

  private clearImage(index: number): void {
    this.productGalleryImages[index].value = null;
    this.productGalleryImages[index].disable = false;
  }

  private shiftImagesUp(startIndex: number): void {
    for (let i = startIndex; i < this.productGalleryImages.length - 1; i++) {
      if (this.productGalleryImages[i].value === null && this.productGalleryImages[i + 1].value !== null) {
        this.productGalleryImages[i].value = this.productGalleryImages[i + 1].value;
        this.productGalleryImages[i + 1].value = null;
        this.productGalleryImages[i].disable = true;
      }
    }
  }

  private updateImageStates(): void {
    let firstEmptySlotFound = false;

    for (let i = 0; i < this.productGalleryImages.length; i++) {
      if (this.productGalleryImages[i].value === null && !firstEmptySlotFound) {
        this.productGalleryImages[i].disable = false;
        firstEmptySlotFound = true;
      } else {
        this.productGalleryImages[i].disable = true;
      }
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

  formBuilder() {
    this.productForm = this.fb.group({
      productName: ['', [Validators.required, Validators.minLength(25)]],
      productMainImage: ['', Validators.required],
      productOption: ['', Validators.required],
    });
  }

  productImageBuilder() {
    this.productMainImage = {
      name: "Tải lên ảnh chỉnh",
      attrs: ["Kích thước: 300x300 px", "Kích thước tập tin tối đa: 5MB", "Format: JPG, JPEG, PNG"
      ],
      formControlName: "mainImage",
      value: null,
      icon: "assets/icons/heroicons/outline/media-image.svg",
      disable: false,
    }

    this.productGalleryImages = [{
      name: "Chính Diện",
      value: null,
      icon: "./assets/images/front.png",
      disable: true,
    }, {
      name: "Cạnh Bên",
      value: null,
      icon: "./assets/images/side.png",
      disable: true,
    }, {
      name: "Góc Độ Khác",
      value: null,
      icon: "./assets/images/another-angle.png",
      disable: true,
    }, {
      name: "Đang sử dụng",
      value: null,
      icon: "./assets/images/using.png",
      disable: true,
    }, {
      name: "Biến Thể",
      value: null,
      icon: "./assets/images/variant.png",
      disable: true,
    }, {
      name: "Cảnh nền",
      value: null,
      icon: "./assets/images/background-perspective.png",
      disable: true,
    }, {
      name: "Chụp cận",
      value: null,
      icon: "./assets/images/close-up-photo.png",
      disable: true,
    }
      , {
      name: "Kích Thước",
      value: null,
      icon: "./assets/images/size-box.png",
      disable: true,
    }]
    console.log("🚀 ~ ProductDetailComponent ~ productImageBuilder ~ productGalleryImages:", this.productGalleryImages)
  }

  drop(event: CdkDragDrop<object[]>) {
    moveItemInArray(this.productGalleryImages, event.previousIndex, event.currentIndex);
  }

  addVariant() {
    console.log(this.isOptions);
    if (!this.isOptions) {
      return;
    }

    this.optionsProductForm.push(new OptionsProductForm({
      key: 'option 1',
      label: '',
      required: true,
      variants: [
        { key: 'image', value: '', required: true },
        { key: 'name', value: '', required: true },
      ],
    }))

    this.utilsService.createComponent(AddVaritantProductFormComponent, this.optionsFrom, { optionsProductForm: this.optionsProductForm });
  }
}
