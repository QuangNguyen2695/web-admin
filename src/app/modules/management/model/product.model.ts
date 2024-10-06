export class SearchOptions {
    product: Produt[] = [];
    pageIdx: number = 0;
    totalItem: number = 0;
    totalPage: number = 0;
}

export class Produt {
    id: string = "";
    name: string = "";
    decs: string = "";
    cate: string = "";
    mainImage: string = "";
}

export class Product2Create {
    name: string = "";
    cate: string = "";
    desc: string = "";
    mainImage: string = "";;
    galleryImage: Array<string> = [];
    variants: Array<ProductVariants> = [];
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
