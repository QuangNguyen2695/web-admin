import { NgModule } from "@angular/core";
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
    exports: [
        NzSelectModule,
        NzSwitchModule,
        NzIconModule
    ]
})
export class NZModule { }
