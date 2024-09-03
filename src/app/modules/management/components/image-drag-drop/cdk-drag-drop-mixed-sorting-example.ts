import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'cdk-drag-drop-mixed',
  templateUrl: 'cdk-drag-drop-mixed-sorting-example.html',
  styleUrl: 'cdk-drag-drop-mixed-sorting-example.scss',
})
export class CdkDragDropMixedSortingExample {
  images = [
    'https://source.unsplash.com/random/200x200?1',
    'https://source.unsplash.com/random/100x100?2',
    'https://source.unsplash.com/random/100x100?3',
    'https://source.unsplash.com/random/100x100?4',
    'https://source.unsplash.com/random/100x100?5',
    'https://source.unsplash.com/random/100x100?6',
  ];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.images, event.previousIndex, event.currentIndex);
  }
}