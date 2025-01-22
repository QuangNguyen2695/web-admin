import { Component } from '@angular/core';
import { ThemeService } from './core/services/theme.service';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe, NgClass } from '@angular/common';
import { ResponsiveHelperComponent } from './shared/components/responsive-helper/responsive-helper.component';
import { NgxSonnerToaster } from 'ngx-sonner';
import { LoaddingScreenComponent } from "./shared/components/loadding-screen/loadding-screen.component";
import { Utils } from './shared/utils/utils';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [NgClass, RouterOutlet, ResponsiveHelperComponent, NgxSonnerToaster, LoaddingScreenComponent],
})
export class AppComponent {
  title = 'Angular Tailwind';

  constructor(public themeService: ThemeService) { }
}
