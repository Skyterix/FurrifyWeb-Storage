import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PostCreateComponent} from "./post-create.component";
import {PostCreateStepsMenuComponent} from "./post-create-steps-menu/post-create-steps-menu.component";
import {PostCreateInfoStepComponent} from "./post-create-info-step/post-create-info-step.component";
import {PostCreateContentStepComponent} from "./post-create-content-step/post-create-content-step.component";
import {PostCreateUploadStepComponent} from "./post-create-upload-step/post-create-upload-step.component";
import {TagCreateComponent} from "./post-create-info-step/tag-create/tag-create.component";
import {ArtistCreateComponent} from "./post-create-info-step/artist-create/artist-create.component";
import {MediaCreateComponent} from "./post-create-content-step/media-create/media-create.component";
import {AttachmentCreateComponent} from "./post-create-content-step/attachment-create/attachment-create.component";
import {MediaSourceItemComponent} from "./post-create-content-step/media-source-item/media-source-item.component";
import {MediaSourceCreateComponent} from "./post-create-content-step/media-source-create/media-source-create.component";
import {
    MediaSourceDeviantArtComponent
} from "./post-create-content-step/media-source-create/media-source-deviantart/media-source-deviant-art.component";
import {
    AttachmentSourceCreateComponent
} from "./post-create-content-step/attachment-source-create/attachment-source-create.component";
import {
    AttachmentSourceDeviantArtComponent
} from "./post-create-content-step/attachment-source-create/attachment-source-deviant-art/attachment-source-deviant-art.component";
import {
    AttachmentSourceItemComponent
} from "./post-create-content-step/attachment-source-item/attachment-source-item.component";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";
import {
    AttachmentSourcePatreonComponent
} from './post-create-content-step/attachment-source-create/attachment-source-patreon/attachment-source-patreon.component';
import {
    MediaSourcePatreonComponent
} from './post-create-content-step/media-source-create/media-source-patreon/media-source-patreon.component';
import {ArtistSourceItemComponent} from './post-create-info-step/artist-source-item/artist-source-item.component';
import {ArtistSourceCreateComponent} from './post-create-info-step/artist-source-create/artist-source-create.component';
import {
    ArtistSourceDeviantArtComponent
} from './post-create-info-step/artist-source-create/artist-source-deviant-art/artist-source-deviant-art.component';
import {
    ArtistSourcePatreonComponent
} from './post-create-info-step/artist-source-create/artist-source-patreon/artist-source-patreon.component';

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
        AttachmentSourceItemComponent,
        AttachmentSourcePatreonComponent,
        MediaSourcePatreonComponent,
        ArtistSourceItemComponent,
        ArtistSourceCreateComponent,
        ArtistSourceDeviantArtComponent,
        ArtistSourcePatreonComponent
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
