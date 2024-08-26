import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionsComponent } from './pages/options/options.component';
import { OptionsValueComponent } from './pages/options-value/options-value.component';
import { MangementModule } from '../../management.module';


@NgModule({
  declarations: [
    OptionsComponent,
    OptionsValueComponent
  ],
  imports: [
    CommonModule,
    MangementModule
  ]
})
export class OptionsModule { }
