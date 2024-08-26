import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

interface PerPageOption {
  id: number;
  value: number;
  disabled?: boolean;
}

@Component({
  selector: 'app-table-footer',
  templateUrl: './table-footer.component.html',
  styleUrl: './table-footer.component.scss',
})
export class TableFooterComponent implements OnChanges {
  @Input() pageIdx = 1;
  @Input() pageSize = 5;
  @Input() totalItem = 0;
  @Input() totalPage = 0;
  @Input() isLoadingOptions = false;

  @Output() reloadDataAndPageEvent = new EventEmitter<any>();

  perPages: PerPageOption[] = [
    { id: 0, value: 5 },
    { id: 1, value: 10 },
    { id: 2, value: 20 },
    { id: 3, value: 30 },
    { id: 4, value: 50 },
    { id: 5, value: 60, disabled: true }
  ];

  startItems = 0;
  endItems = 0;
  pagination: number[] = [];

  ngOnChanges(): void {
    this.createPagination();
  }

  /**
   * Creates the pagination array and calculates start and end items
   */
  createPagination(): void {
    this.startItems = (this.pageIdx - 1) * this.pageSize + 1;
    this.endItems = Math.min(this.pageIdx * this.pageSize, this.totalItem);

    const beforePage = this.pageIdx === this.totalPage ? this.pageIdx - 2 : this.pageIdx - 1;
    const afterPage = this.pageIdx === 1 ? this.pageIdx + 2 : this.pageIdx + 1;

    this.pagination = [];
    for (let page = Math.max(1, beforePage); page <= Math.min(afterPage, this.totalPage); page++) {
      this.pagination.push(page);
    }
  }

  /**
   * Moves to the next page if possible
   */
  nextPage(): void {
    if (this.pageIdx < this.totalPage && !this.isLoadingOptions) {
      this.pageIdx++;
      this.reloadDataAndPage();
    }
  }

  /**
   * Moves to the previous page if possible
   */
  previousPage(): void {
    if (this.pageIdx > 1 && !this.isLoadingOptions) {
      this.pageIdx--;
      this.reloadDataAndPage();
    }
  }

  /**
   * Goes to a specific page
   * @param page The page number to go to
   */
  goToPage(page: number): void {
    if (this.pageIdx !== page && !this.isLoadingOptions) {
      this.pageIdx = page;
      this.reloadDataAndPage();
    }
  }

  /**
   * Change PerPage
   */

  changePerPage($event: any): void {
    this.pageSize = $event.target.value;
    this.reloadDataAndPage();
  }

  /**
   * Reloads products and updates pagination
   */
  private reloadDataAndPage(): void {
    this.reloadDataAndPageEvent.emit({ pageIdx: this.pageIdx, pageSize: this.pageSize });
    this.createPagination();
  }
}
