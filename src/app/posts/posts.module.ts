import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavComponent} from "./nav/nav.component";
import {PostsComponent} from "./posts.component";
import {PostsRoutingModule} from "./posts-routing.module";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {ReactiveFormsModule} from "@angular/forms";
import {SearchComponent} from './nav/search/search.component';
import {PostListComponent} from './post-list/post-list.component';
import {PostItemComponent} from './post-list/post-item/post-item.component';
import {SharedModule} from "../shared/shared.module";
import {SortNavComponent} from './post-list/sort-nav/sort-nav.component';
import {PostViewComponent} from './post-view/post-view.component';
import {PostItemsComponent} from './post-view/post-items/post-items.component';
import {PostDetailsComponent} from './post-view/post-details/post-details.component';
import {AttachmentIconDirective} from "./post-view/post-items/attachment-icon.directive";
import {DropdownDirective} from "./nav/dropdown.directive";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {PaginatorComponent} from './post-list/paginator/paginator.component';
import {GalleryViewComponent} from './post-view/post-details/gallery-view/gallery-view.component';
import {
    PostDeleteConfirmationComponent
} from './confirmations/post-delete-confirmation/post-delete-confirmation.component';


@NgModule({
    declarations: [
        PostsComponent,
        NavComponent,
        SearchComponent,
        PostListComponent,
        PostItemComponent,
        SortNavComponent,
        PostViewComponent,
        PostItemsComponent,
        PostDetailsComponent,
        AttachmentIconDirective,
        DropdownDirective,
        PaginatorComponent,
        GalleryViewComponent,
        PostDeleteConfirmationComponent
    ],
    imports: [
        CommonModule,
        DragDropModule,
        FontAwesomeModule,
        ReactiveFormsModule,
        PostsRoutingModule,
        SharedModule
    ],
    bootstrap: []
})
export class PostsModule {
}
