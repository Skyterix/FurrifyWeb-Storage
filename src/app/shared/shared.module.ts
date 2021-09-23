import {NgModule} from '@angular/core';
import {ColoredTagDirective} from "./directive/colored-tag.directive";

@NgModule({
    declarations: [
        ColoredTagDirective
    ],
    exports: [
        ColoredTagDirective
    ],
    imports: []
})
export class SharedModule {
}
