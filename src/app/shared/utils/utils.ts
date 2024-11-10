import { Injectable } from '@angular/core';
import { toast } from 'ngx-sonner';
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

    handleRequestError(error: any): void {
        const msg = 'An error occurred while processing your request';
        toast.error(msg, {
            position: 'bottom-right',
            description: error.message || 'Please try again later',
            action: {
                label: 'Dismiss',
                onClick: () => { },
            },
            actionButtonStyle: 'background-color:#DC2626; color:white;',
        });
    }
}
