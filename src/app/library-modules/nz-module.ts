import { NgModule } from "@angular/core";
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { NzPipesModule } from 'ng-zorro-antd/pipes';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
@NgModule({
    exports: [
        NzSelectModule,
        NzSwitchModule,
        NzIconModule,
        NzCheckboxModule,
        NzTreeViewModule,
        NzPipesModule,
        NzAutocompleteModule
    ]
})
export class NZModule { }
