export class SearchCategories {
  categories: Category[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
}

export class Category {
  id: number = 0;
  name: string = '';
  parentId: number = 0;
  indexTreeCategories: number = 0;
  description: string = '';
  selected: boolean = false;
}

export class Category2Create {
  name: string = '';
  description: string = '';
}


export interface CategoryFlatNode {
  id: number
  name: string;

  expandable: boolean;
  level: number;
  disabled: boolean;
  isSelected: boolean;
}

// Define interface for the tree node structure
export interface CategoryTreeNode extends Category {
  name: string;
  disabled?: boolean;
  children: CategoryTreeNode[];
}

export interface AccumulatorCategoryype {
  nodeMap: { [key: number]: CategoryTreeNode };
  roots: CategoryTreeNode[];
}

export class FilteredCategoryTreeResult {
  constructor(
    public treeData: CategoryTreeNode[],
    public needsToExpanded: CategoryTreeNode[] = []
  ) { }
}