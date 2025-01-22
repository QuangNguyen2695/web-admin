import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { Options, SearchOptions } from 'src/app/modules/management/model/options.model';
import { OptionsService } from '../../../service/options.servive';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { CreateEditOptionDialogComponent } from '../../component/create-edit-option-dialog/create-edit-option-dialog.component';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
})
export class OptionsComponent implements OnInit {
  searchOptions: SearchOptions = new SearchOptions();
  selectAll: boolean = false;
  pageIdx: number = 1;
  pageSize: number = 5;
  totalPage: number = 0;
  totalItem: number = 0;
  keyword: string = '';
  sortBy: string = '';

  isLoadingOptions: boolean = false;

  constructor(private optionsService: OptionsService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoadingOptions = true;
    this.optionsService.searchOptions(this.pageIdx, this.pageSize, this.keyword, this.sortBy).subscribe({
      next: (res: SearchOptions) => {
        if (res) {
          this.searchOptions = res;
          this.totalItem = this.searchOptions.totalItem;
          this.totalPage = this.searchOptions.totalPage;
        }
        this.isLoadingOptions = false;
      },
      error: (error) => {
        this.handleRequestError(error);
        this.isLoadingOptions = false;
      },
    });
  }

  toggleOptions(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.searchOptions.options = this.searchOptions.options.map((option: Options) => ({
      ...option,
      selected: checked,
    }));
  }

  checkSelectAll(): void {
    this.selectAll = !this.searchOptions.options.some((option) => !option.selected);
  }

  deleteOption(id: string): void {
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
           type: 'dangerous'
        },
        title: 'Delete Option',
        content:
          'Are you sure you want to delete this option? All of your data will be permanently removed. This action cannot be undone.',
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
        this.optionsService.deleteOption(id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchOptions.options = this.searchOptions.options.filter((option) => option.id !== id);
              toast.success('Option deleted successfully');
            }
          },
          error: (error) => this.handleRequestError(error),
        });
      }
    });
  }

  editOption(option: Options): void {
    const dialogRef = this.dialog.open(CreateEditOptionDialogComponent, {
      data: {
        title: 'Edit Option',
        option: { ...option },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.optionsService.updateOption(result).subscribe({
          next: (res: Options) => {
            if (res) {
              this.searchOptions.options = this.searchOptions.options.map((opt: Options) =>
                opt.id === res.id ? { ...opt, ...res } : opt,
              );
              toast.success('Option updated successfully');
            }
          },
          error: (error) => this.handleRequestError(error),
        });
      }
    });
  }

  addOption(): void {
    const dialogRef = this.dialog.open(CreateEditOptionDialogComponent, {
      data: {
        title: 'Add New Option',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.optionsService.createOption(result).subscribe({
          next: (res: Options) => {
            if (res) {
              this.loadData();
              toast.success('Option added successfully');
            }
          },
          error: (error) => this.handleRequestError(error),
        });
      }
    });
  }

  reloadOptionsPage(data: any): void {
    this.pageIdx = data.pageIdx;
    this.pageSize = data.pageSize;
    this.loadData();
  }

  searchOptionsPage(keyword: string) {
    this.pageIdx = 1;
    this.keyword = keyword;
    this.loadData();
  }

  sortOptionsPage(sortBy: string) {
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
        onClick: () => {},
      },
      actionButtonStyle: 'background-color:#DC2626; color:white;',
    });
  }
}
