import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CreateEditOptionDialogComponent } from './modules/management/modules/options/component/create-edit-option-dialog/create-edit-option-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { MaterialModule } from './library-modules/material-module';
import { provideNzI18n, en_US } from 'ng-zorro-antd/i18n';
import { UtilsService } from './base/utils.sevice';

@NgModule({
  declarations: [CreateEditOptionDialogComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,

    FormsModule,
    ReactiveFormsModule,

    MaterialModule,
  ],
  providers: [provideAnimationsAsync(), provideAnimations(), provideNzI18n(en_US), UtilsService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
