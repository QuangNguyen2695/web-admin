import { Component, Input } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { LoadingService } from '../../utils/loading.service';

@Component({
  selector: 'app-loadding-screen',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './loadding-screen.component.html',
  styleUrl: './loadding-screen.component.scss'
})
export class LoaddingScreenComponent {
  @Input()
  detectRouteTransitions = false;

  loading$: boolean = false;

  constructor(public loadingService: LoadingService, private router: Router) {
    this.loadingService.loading$.subscribe((res: any) => {
      this.loading$ = res;
    });
  }

  ngOnInit() {
    if (this.detectRouteTransitions) {
      this.router.events
        .pipe(
          tap((event: any) => {
            if (event instanceof RouteConfigLoadStart) {
              this.loadingService.loadingOn();
            } else if (event instanceof RouteConfigLoadEnd) {
              this.loadingService.loadingOff();
            }
          })
        )
        .subscribe();
    }
  }
}
