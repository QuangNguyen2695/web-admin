import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent {
  @Input() disable = false;
  isVisible: boolean = false;
  position: { top: string; left: string } = { top: '-5.3rem', left: '0%' };

  show() {
    this.isVisible = true;
  }

  hide() {
    this.isVisible = false;
  }
}
