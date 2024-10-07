import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class Utils {

    private loadingSubject = new BehaviorSubject<boolean>(false);
    loading$ = this.loadingSubject.asObservable();

    constructor() {
    }

    showLoading(timeout?: number) {
        this.loadingSubject.next(true);
        setInterval(() => {
            this.loadingSubject.next(false);
        }, timeout || 5000);
    }

    hideLoading() {
        this.loadingSubject.next(false);
    }
}
