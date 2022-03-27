import {NgModule} from '@angular/core';
import {ColoredTagDirective} from "./directive/colored-tag.directive";
import {RemoveTextPipe} from "./pipe/remove-text.pipe";
import {AccountLinkDirective} from './directive/account-link.directive';
import {SourceToHrefDirective} from './directive/source-to-href.directive';

@NgModule({
    declarations: [
        ColoredTagDirective,
        RemoveTextPipe,
        AccountLinkDirective,
        SourceToHrefDirective
    ],
    exports: [
        ColoredTagDirective,
        RemoveTextPipe,
        AccountLinkDirective,
        SourceToHrefDirective
    ],
    imports: []
})
export class SharedModule {
}
