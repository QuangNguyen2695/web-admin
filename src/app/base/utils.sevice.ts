import { ComponentFactoryResolver, Injectable, ViewContainerRef } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class UtilsService {
    constructor(private componentFactoryResolver: ComponentFactoryResolver) {

    }

    createComponent(component: any, emlement: any, params: any) {
        const factory = this.componentFactoryResolver.resolveComponentFactory(component);
        emlement.clear();
        let ref = emlement.createComponent(factory, 0);
        if (params) {
            ref.instance.params = params;
        }
    }

    clearComponent(emlement: any) {
        emlement.clear();
    }

}
