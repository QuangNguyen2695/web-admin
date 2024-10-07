export class SearchProducts {
    products: Product[] = [];
    pageIdx: number = 0;
    totalItem: number = 0;
    totalPage: number = 0;
}

export class Product {
    id: string = "";
    name: string = "";
    desc: string = "";
    cate: string = "";
    mainImage: string = "";
    galleryImage: Array<string> = [];
    selected: boolean = false;
}

export class Product2Create {
    id?: string = "";
    name: string = "";
    cate: string = "";
    desc: string = "";
    mainImage: string = "";
    galleryImage: Array<string> = [];
    options: Array<ProductOption> = [];
    variants: Array<ProductVariants> = [];
}

export class ProductOption {
    option_id: string = "";
    option_values: Array<ProductOptionValue> = [];
    isOptionSetup: boolean = false
}

export class ProductOptionValue {
    name: string = "";
}


export class ProductVariants {
    upc: string = "";
    qty: number = 0;
    price: string = "";
    option_values: Array<VariantOptionValues> = [];
}

export class VariantOptionValues {
    image?: string = "";
    name: string = "";
    option_id: string = "";
}
