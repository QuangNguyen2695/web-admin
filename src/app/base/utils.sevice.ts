import { ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  ref: ComponentRef<any> | undefined;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  createComponent(component: any, emlement: any, params: any) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(component);
    this.ref && this.ref.destroy();
    this.ref = emlement.createComponent(factory, 0);
    if (params && this.ref) {
      this.ref.instance.params = params;
    }
  }

  clearComponent() {
    this.ref && this.ref.destroy();
  }

  createRange(number: any) {
    return new Array(number).fill(0).map((n, index) => index + 1);
  }
}
