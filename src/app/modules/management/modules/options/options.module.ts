import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionsComponent } from './pages/options/options.component';
import { MangementModule } from '../../management.module';

@NgModule({
  declarations: [OptionsComponent],
  imports: [CommonModule, MangementModule],
})
export class OptionsModule {}
