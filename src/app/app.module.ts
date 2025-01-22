import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { MaterialModule } from './library-modules/material-module';
import { provideNzI18n, en_US } from 'ng-zorro-antd/i18n';
import { UtilsService } from './base/utils.sevice';
import { ENV } from '@app/env';

@NgModule({
  declarations: [],
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
export class AppModule {}
