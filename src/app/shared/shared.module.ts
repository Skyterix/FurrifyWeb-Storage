import {NgModule} from '@angular/core';
import {ColoredTagDirective} from "./directive/colored-tag.directive";
import {RemoveTextPipe} from "./pipe/remove-text.pipe";

@NgModule({
    declarations: [
        ColoredTagDirective,
        RemoveTextPipe
    ],
    exports: [
        ColoredTagDirective,
        RemoveTextPipe
    ],
    imports: []
})
export class SharedModule {
}
