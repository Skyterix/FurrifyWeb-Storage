import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PostCreateComponent} from "./post-create.component";
import {PostCreateStepsMenuComponent} from "./post-create-steps-menu/post-create-steps-menu.component";
import {PostCreateInfoStepComponent} from "./post-create-info-step/post-create-info-step.component";
import {PostCreateContentStepComponent} from "./post-create-content-step/post-create-content-step.component";
import {PostCreateUploadStepComponent} from "./post-create-upload-step/post-create-upload-step.component";
import {TagCreateComponent} from "./tag-create/tag-create.component";
import {ArtistCreateComponent} from "./artist-create/artist-create.component";
import {MediaCreateComponent} from "./media-create/media-create.component";
import {AttachmentCreateComponent} from "./attachment-create/attachment-create.component";
import {MediaSourceItemComponent} from "./post-create-content-step/media-source-item/media-source-item.component";
import {MediaSourceCreateComponent} from "./media-source-create/media-source-create.component";
import {
    MediaSourceDeviantArtComponent
} from "./media-source-create/media-source-deviantart/media-source-deviant-art.component";
import {AttachmentSourceCreateComponent} from "./attachment-source-create/attachment-source-create.component";
import {
    AttachmentSourceDeviantArtComponent
} from "./attachment-source-create/attachment-source-deviant-art/attachment-source-deviant-art.component";
import {
    AttachmentSourceItemComponent
} from "./post-create-content-step/attachment-source-item/attachment-source-item.component";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";

@NgModule({
    declarations: [
        PostCreateComponent,
        PostCreateStepsMenuComponent,
        PostCreateInfoStepComponent,
        PostCreateContentStepComponent,
        PostCreateUploadStepComponent,
        TagCreateComponent,
        ArtistCreateComponent,
        MediaCreateComponent,
        AttachmentCreateComponent,
        MediaSourceItemComponent,
        MediaSourceCreateComponent,
        MediaSourceDeviantArtComponent,
        AttachmentSourceCreateComponent,
        AttachmentSourceDeviantArtComponent,
        AttachmentSourceItemComponent
    ],
    imports: [
        CommonModule,
        DragDropModule,
        FontAwesomeModule,
        ReactiveFormsModule,
        SharedModule
    ],
    bootstrap: [
        PostCreateComponent,
        PostCreateStepsMenuComponent,
        PostCreateInfoStepComponent
    ]
})
export class PostCreateModule {
}
