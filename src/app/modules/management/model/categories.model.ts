export class SearchCategories {
  categories: Category[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
}

export class Category {
  id: string = '';
  name: string = '';
  description: string = '';
  selected: boolean = false;
}

export class Category2Create {
  name: string = '';
  description: string = '';
}
