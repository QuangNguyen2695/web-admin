import { NgModule } from "@angular/core";
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

@NgModule({
    exports: [
        NzSelectModule,
        NzSwitchModule,
        NzIconModule,
        NzCheckboxModule
    ]
})
export class NZModule { }
