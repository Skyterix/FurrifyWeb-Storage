import {NgModule} from '@angular/core';
import {ColoredTagDirective} from "./directive/colored-tag.directive";
import {RemoveSourceStrategyTextPipe} from "./pipe/remove-source-strategy-text.pipe";
import {AccountLinkDirective} from './directive/account-link.directive';
import {SourceToHrefDirective} from './directive/source-to-href.directive';
import {GalleryViewComponent} from "./component/gallery-view/gallery-view.component";
import {
    DeleteConfirmationComponent
} from "./component/confirmations/post-delete-confirmation/delete-confirmation.component";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {CommonModule} from "@angular/common";

@NgModule({
    declarations: [
        ColoredTagDirective,
        RemoveSourceStrategyTextPipe,
        AccountLinkDirective,
        SourceToHrefDirective,
        GalleryViewComponent,
        DeleteConfirmationComponent
    ],
    exports: [
        ColoredTagDirective,
        RemoveSourceStrategyTextPipe,
        AccountLinkDirective,
        SourceToHrefDirective,
        GalleryViewComponent,
        DeleteConfirmationComponent
    ],
    imports: [
        FontAwesomeModule,
        CommonModule
    ]
})
export class SharedModule {
}
