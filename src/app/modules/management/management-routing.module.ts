import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OptionsComponent } from './modules/options/pages/options/options.component';
import { OptionsValueComponent } from './modules/options/pages/options-value/options-value.component';
import { ManagementComponent } from './management.component';

const routes: Routes = [
  {
    path: '',
    component: ManagementComponent,
    children: [
      { path: '', redirectTo: 'management', pathMatch: 'full' },
      {
        path: 'options',
        component: OptionsComponent,
        loadChildren: () => import('./modules/options/options.module').then((m) => m.OptionsModule),
      },
      { path: 'options-value', component: OptionsValueComponent },
      { path: '**', redirectTo: 'errors/404' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementRoutingModule { }
