import {NgModule} from '@angular/core';
import {ColoredTagDirective} from "./directive/colored-tag.directive";
import {RemoveSourceStrategyTextPipe} from "./pipe/remove-source-strategy-text.pipe";
import {AccountLinkDirective} from './directive/account-link.directive';
import {SourceToHrefDirective} from './directive/source-to-href.directive';

@NgModule({
    declarations: [
        ColoredTagDirective,
        RemoveSourceStrategyTextPipe,
        AccountLinkDirective,
        SourceToHrefDirective
    ],
    exports: [
        ColoredTagDirective,
        RemoveSourceStrategyTextPipe,
        AccountLinkDirective,
        SourceToHrefDirective
    ],
    imports: []
})
export class SharedModule {
}
