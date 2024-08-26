import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule } from '@angular/forms';
import { TableHeaderComponent } from './components/table-header/table-header.component';
import { TableFooterComponent } from './components/table-footer/table-footer.component';
import { TableRowComponent } from './components/table-row/table-row.component';
import { TableActionComponent } from './components/table-action/table-action.component';
import { ManagementRoutingModule } from './management-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { OptionsModule } from './modules/options/options.module';

@NgModule({
  declarations: [
    TableHeaderComponent,
    TableFooterComponent,
    TableRowComponent,
    TableActionComponent,
  ],
  imports: [
    CommonModule,
    ManagementRoutingModule,
    AngularSvgIconModule,
    FormsModule,
  ],
  exports: [
    TableHeaderComponent,
    TableFooterComponent,
    TableRowComponent,
    TableActionComponent,

    AngularSvgIconModule,
    FormsModule,
  ]
})
export class MangementModule { }
