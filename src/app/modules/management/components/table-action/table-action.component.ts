import { Component, EventEmitter, Input, Output } from '@angular/core';
import { debounce, debounceTime, delay, interval, map, of, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-table-action',
  templateUrl: './table-action.component.html',
  styleUrl: './table-action.component.scss',
})
export class TableActionComponent {
  @Input() title: string = "";
  @Input() totalItem: number = 0;


  @Output() searchDataEvent = new EventEmitter<any>()
  @Output() sortDataEvent = new EventEmitter<any>()


  ngOnInit() {

  }

  constructor() {
  }

  onEnter($event: any) {
    const keyword = $event.target.value;
    this.searchDataEvent.emit(keyword);
  }

  changeSortBy($event: any) {
    const sortBy = $event.target.value;
    this.sortDataEvent.emit(sortBy);
  }

  //use for auto complate input
  // searchKeywordChagne(value: any) {
  //   const keyword = of(value);
  //   console.log("🚀 ~ TableActionComponent ~ searchKeywordChagne ~ keyword:", keyword)

  //   const sub = keyword.pipe(delay(500))
  //   sub.subscribe((data: any) => {
  //     console.log("🚀 ~ TableActionComponent ~ ).subscribe ~ data:", data)
  //   });
  // }

}
