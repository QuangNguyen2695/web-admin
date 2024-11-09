import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { AccumulatorCategoryype, Category, CategoryFlatNode, CategoryTreeNode, FilteredCategoryTreeResult, SearchCategories } from 'src/app/modules/management/model/categories.model';
import { CatagoriesService } from '../../../service/categories.servive';
import { CreateEditCategoriesDialogComponent } from '../../component/create-edit-category-dialog/create-edit-category-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { auditTime, BehaviorSubject, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  searchCategories: SearchCategories = new SearchCategories();
  treeCategories: Category[] = [];
  selectAll: boolean = false;
  pageIdx: number = 1;
  pageSize: number = 9999;
  totalPage: number = 0;
  totalItem: number = 0;
  keyword: string = '';
  sortBy: string = '';
  isLoadingCategories: boolean = false;

  treeFlattener: any;
  dataSource: any;

  flatNodeMap = new Map<CategoryFlatNode, CategoryTreeNode>();
  nestedNodeMap = new Map<CategoryTreeNode, CategoryFlatNode>();
  checklistSelection = new SelectionModel<CategoryFlatNode>(true);

  treeControl = new FlatTreeControl<CategoryFlatNode>(
    node => node.level,
    node => node.expandable
  );

  expandedNodes: CategoryFlatNode[] = [];

  searchValue = '';
  searchValue$ = new BehaviorSubject<string>('');

  originData$ = new BehaviorSubject<Category[]>([]);

  filteredData$ = combineLatest([
    this.originData$,
    this.searchValue$.pipe(
      auditTime(300),
      map(value => (this.searchValue = value))
    )
  ]).pipe(map(([data, value]: any) => (value ? this.filterTreeData(data, value) : new FilteredCategoryTreeResult(data))));

  constructor(private catagoriesService: CatagoriesService, private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.loadData();

    this.treeFlattener = new NzTreeFlattener(
      this.transformer,
      node => node.level,
      node => node.expandable,
      node => node.children
    );
    this.dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this.filteredData$.subscribe((result: any) => {
      this.dataSource.setData(result.treeData);

      const hasSearchValue = !!this.searchValue;
      if (!hasSearchValue) {
        if (this.expandedNodes.length === 0) {
          this.expandedNodes = this.treeControl.expansionModel.selected;
          this.treeControl.expansionModel.clear();
        }
        this.treeControl.expansionModel.select(...result.needsToExpanded);
      } else {
        if (this.expandedNodes.length) {
          this.treeControl.expansionModel.clear();
          this.treeControl.expansionModel.select(...this.expandedNodes);
          this.expandedNodes = [];
        }
      }

      this.treeControl.expandAll();
    });

  }

  filterTreeData(data: CategoryTreeNode[], value: string): FilteredCategoryTreeResult {
    const needsToExpanded = new Set<CategoryTreeNode>();
    const _filter = (node: CategoryTreeNode, result: CategoryTreeNode[]): CategoryTreeNode[] => {
      if (node.name.search(value) !== -1) {
        result.push(node);
        return result;
      }
      if (Array.isArray(node.children)) {
        const nodes = node.children.reduce((a, b) => _filter(b, a), [] as CategoryTreeNode[]);
        if (nodes.length) {
          const parentNode = { ...node, children: nodes };
          needsToExpanded.add(parentNode);
          result.push(parentNode);
        }
      }
      return result;
    };
    const treeData = data.reduce((a, b) => _filter(b, a), [] as CategoryTreeNode[]);
    return new FilteredCategoryTreeResult(treeData, [...needsToExpanded]);
  }

  transformer = (node: CategoryTreeNode, level: number): CategoryFlatNode => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.name === node.name
        ? existingNode
        : {
          expandable: !!node.children && node.children.length > 0,
          name: node.name,
          level,
          disabled: !!node.disabled
        };
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };


  loadData(): void {
    this.isLoadingCategories = true;
    this.catagoriesService.searchCaterogies(this.pageIdx, this.pageSize, this.keyword, this.sortBy).subscribe({
      next: (res: SearchCategories) => {
        if (res) {
          this.searchCategories = res;
          this.treeCategories = this.buildCategoryTree(res.categories);
          this.originData$.next(this.treeCategories)
          console.log("🚀 ~ CategoriesComponent ~ this.catagoriesService.searchCaterogies ~ this.treeCategories:", this.treeCategories)
          this.totalItem = this.searchCategories.totalItem;
          this.totalPage = this.searchCategories.totalPage;
        }
        this.isLoadingCategories = false;
      },
      error: (error) => {
        this.handleRequestError(error);
        this.isLoadingCategories = false;
      },
    });
  }

  buildCategoryTree(categories: Category[]): CategoryTreeNode[] {
    // Sort categories by indexTreeCategories to ensure proper order
    const sortedCategories = [...categories].sort(
      (a: Category, b: Category) => a.indexTreeCategories - b.indexTreeCategories
    );

    const { nodeMap, roots } = sortedCategories.reduce<AccumulatorCategoryype>(
      (acc, category: any) => {
        // Create node with empty children array
        acc.nodeMap[category.id] = { ...category, children: [] };

        // If no parentId, it's a root node
        if (!category.parentId) {
          acc.roots.push(acc.nodeMap[category.id]);
        }

        return acc;
      },
      { nodeMap: {}, roots: [] }
    );

    // Build the hierarchical structure
    return sortedCategories.reduce<CategoryTreeNode[]>(
      (rootNodes, category: Category) => {
        if (category.parentId && nodeMap[category.parentId]) {
          nodeMap[category.parentId].children.push(nodeMap[category.id]);
        }
        return rootNodes;
      },
      roots
    );
  }

  toggleCategories(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.searchCategories.categories = this.searchCategories.categories.map((category: Category) => ({
      ...category,
      selected: checked,
    }));
  }

  checkSelectAll(): void {
    this.selectAll = !this.searchCategories.categories.some((category) => !category.selected);
  }

  deleteCategory(id: number): void {
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
          type: 'dangerous'
        },
        title: 'Delete Category',
        content:
          'Are you sure you want to delete this category? All of your data will be permanently removed. This action cannot be undone.',
        btn: [
          {
            label: 'NO',
            type: 'cancel'
          },
          {
            label: 'YES',
            type: 'submit'
          },
        ]
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.catagoriesService.deleteCategory(id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchCategories.categories = this.searchCategories.categories.filter((category) => category.id !== id);
              toast.success('Category deleted successfully');
            }
          },
          error: (error) => this.handleRequestError(error),
        });
      }
    });
  }

  editCategory(category: Category): void {
    const dialogRef = this.dialog.open(CreateEditCategoriesDialogComponent, {
      data: {
        title: 'Edit Category',
        category: { ...category },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.catagoriesService.updateCategory(result).subscribe({
          next: (res: Category) => {
            if (res) {
              this.searchCategories.categories = this.searchCategories.categories.map((category: Category) =>
                category.id === res.id ? { ...category, ...res } : category,
              );
              toast.success('Category updated successfully');
            }
          },
          error: (error) => this.handleRequestError(error),
        });
      }
    });
  }

  addCategory(): void {
    const dialogRef = this.dialog.open(CreateEditCategoriesDialogComponent, {
      data: {
        title: 'Add New Category',
        listCategories: this.treeCategories
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.catagoriesService.createCategory(result).subscribe({
          next: (res: Category) => {
            if (res) {
              this.loadData();
              toast.success('Category added successfully');
            }
          },
          error: (error) => this.handleRequestError(error),
        });
      }
    });
  }

  reloadCategoriesPage(data: any): void {
    this.pageIdx = data.pageIdx;
    this.pageSize = data.pageSize;
    this.loadData();
  }

  searchCategoriesPage(keyword: string) {
    this.pageIdx = 1;
    this.keyword = keyword;
    this.loadData();
  }

  sortCategoriesPage(sortBy: string) {
    this.sortBy = sortBy;
    this.loadData();
  }

  private handleRequestError(error: any): void {
    const msg = 'An error occurred while processing your request';
    toast.error(msg, {
      position: 'bottom-right',
      description: error.message || 'Please try again later',
      action: {
        label: 'Dismiss',
        onClick: () => { },
      },
      actionButtonStyle: 'background-color:#DC2626; color:white;',
    });
  }


  //handle tree view
  hasChild = (_: number, node: CategoryFlatNode): boolean => node.expandable;

  descendantsAllSelected(node: CategoryFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.length > 0 && descendants.every(child => this.checklistSelection.isSelected(child));
  }

  descendantsPartiallySelected(node: CategoryFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  leafItemSelectionToggle(node: CategoryFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  itemSelectionToggle(node: CategoryFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  checkAllParentsSelection(node: CategoryFlatNode): void {
    let parent: CategoryFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  checkRootNodeSelection(node: CategoryFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 && descendants.every(child => this.checklistSelection.isSelected(child));
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  getParentNode(node: CategoryFlatNode): CategoryFlatNode | null {
    const currentLevel = node.level;

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (currentNode.level < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }
}
