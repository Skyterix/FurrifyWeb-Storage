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
import {PostCreateComponent} from './post-create/post-create.component';
import {PostCreateStepsMenuComponent} from './post-create/post-create-steps-menu/post-create-steps-menu.component';
import {PostCreateInfoStepComponent} from './post-create/post-create-info-step/post-create-info-step.component';
import {
    PostCreateContentStepComponent
} from './post-create/post-create-content-step/post-create-content-step.component';
import {PostCreateUploadStepComponent} from './post-create/post-create-upload-step/post-create-upload-step.component';
import {TagCreateComponent} from './post-create/tag-create/tag-create.component';
import {ArtistCreateComponent} from './post-create/artist-create/artist-create.component';
import {MediaCreateComponent} from './post-create/media-create/media-create.component';
import {AttachmentCreateComponent} from './post-create/attachment-create/attachment-create.component';
import {DragDropModule} from "@angular/cdk/drag-drop";
import {PaginatorComponent} from './post-list/paginator/paginator.component';
import {GalleryViewComponent} from './post-view/post-details/gallery-view/gallery-view.component';
import {SourceItemComponent} from './post-create/post-create-content-step/source-item/source-item.component';


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
        PostCreateComponent,
        PostCreateStepsMenuComponent,
        PostCreateInfoStepComponent,
        PostCreateContentStepComponent,
        PostCreateUploadStepComponent,
        TagCreateComponent,
        ArtistCreateComponent,
        MediaCreateComponent,
        AttachmentCreateComponent,
        PaginatorComponent,
        GalleryViewComponent,
        SourceItemComponent
    ],
    imports: [
        CommonModule,
        DragDropModule,
        FontAwesomeModule,
        PostsRoutingModule,
        ReactiveFormsModule,
        SharedModule
    ],
    bootstrap: [
        PostCreateComponent,
        PostCreateInfoStepComponent,
        PostCreateContentStepComponent,
        PostCreateUploadStepComponent,
        ArtistCreateComponent,
        MediaCreateComponent,
        AttachmentCreateComponent,
        TagCreateComponent
    ]
})
export class PostsModule {
}
