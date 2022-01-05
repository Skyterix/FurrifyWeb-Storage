import {NgModule} from '@angular/core';
import {ColoredTagDirective} from "./directive/colored-tag.directive";
import {RemoveTextPipe} from "./pipe/remove-text.pipe";
import {AccountLinkDirective} from './directive/account-link.directive';

@NgModule({
    declarations: [
        ColoredTagDirective,
        RemoveTextPipe,
        AccountLinkDirective
    ],
    exports: [
        ColoredTagDirective,
        RemoveTextPipe,
        AccountLinkDirective
    ],
    imports: []
})
export class SharedModule {
}
