import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {PostCreateService} from "../post-create.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";
import * as fromApp from "../../../store/app.reducer";
import {CreateMedia} from "../../../shared/model/request/create-media.model";
import {faUpload} from "@fortawesome/free-solid-svg-icons/faUpload";
import {EXTENSION_EXTRACT_REGEX, FILENAME_REGEX} from "../../../shared/config/common.constats";
import {MediaExtensionsConfig} from "../../../shared/config/media-extensions.config";
import {ThumbnailExtensionsConfig} from "../../../shared/config/thumbnail-extensions.config";
import {addMedia} from "../store/post-create.actions";
import {MediaWrapper} from "../store/post-create.reducer";

@Component({
    selector: 'app-media-create',
    templateUrl: './media-create.component.html',
    styleUrls: ['./media-create.component.css']
})
export class MediaCreateComponent implements OnInit {

    @ViewChild('article', {read: ElementRef}) articleRef!: ElementRef;

    uploadIcon = faUpload;

    mediaThumbnailFileForm!: FormGroup;
    mediaFileForm: FormGroup;

    selectedThumbnailFile!: File | undefined;
    selectedMediaFile!: File;
    errorMessage!: string;

    constructor(private postCreateService: PostCreateService,
                private store: Store<fromApp.AppState>,
                private renderer: Renderer2) {
        // Add file forms
        this.mediaFileForm = new FormGroup({
            mediaFile: new FormControl(null, [Validators.required])
        });
        this.mediaThumbnailFileForm = new FormGroup({
            thumbnailFile: new FormControl(null, [Validators.required])
        });
    }

    ngOnInit(): void {
    }

    onClose(): void {
        this.renderer.addClass(this.articleRef.nativeElement, "animate__fadeOut");

        // Let the animation finish
        setTimeout(() => {
            this.postCreateService.clearPostCreateSideStepModalEvent.emit();
        }, 100);
    }

    onThumbnailFileSelected(event: any): void {
        this.errorMessage = "";

        // If file is not selected
        if (event.target.files.length === 0) {
            return;
        }

        // Is filename is invalid
        if (!FILENAME_REGEX.test(event.target.files[0].name)) {
            this.errorMessage = "File \"" + event.target.files[0].name + "\" has invalid name."

            this.mediaThumbnailFileForm.reset();
        }

        const extension = EXTENSION_EXTRACT_REGEX.exec(event.target.files[0].name);

        /* Check extension against accepted extensions list.
           The check for null is not required, regex check above ensures that extension must be present. */
        if (!ThumbnailExtensionsConfig.EXTENSIONS.includes(extension![1].toLowerCase())) {
            this.errorMessage = "File \"" + event.target.files[0].name + "\" has extension which is not accepted as thumbnail."

            this.mediaThumbnailFileForm.reset();
        }

        this.selectedThumbnailFile = event.target.files[0];
    }

    onMediaFileSelected(event: any): void {
        this.errorMessage = "";

        // If file is not selected
        if (event.target.files.length === 0) {
            return;
        }

        // Is filename is invalid
        if (!FILENAME_REGEX.test(event.target.files[0].name)) {
            this.errorMessage = "File \"" + event.target.files[0].name + "\" has invalid name."

            this.mediaFileForm.reset();
        }

        const extension = EXTENSION_EXTRACT_REGEX.exec(event.target.files[0].name);

        /* Check extension against accepted extensions list.
           The check for null is not required, regex check above ensures that extension must be present. */
        if (!MediaExtensionsConfig.EXTENSIONS.includes(extension![1].toLowerCase())) {
            this.errorMessage = "File \"" + event.target.files[0].name + "\" has extension which is not accepted as media."

            this.mediaFileForm.reset();
        }

        this.selectedMediaFile = event.target.files[0];
    }

    onSubmit(): void {
        if (!this.selectedMediaFile) {
            return;
        }

        const fileExtension = MediaExtensionsConfig.PREFIX +
            this.selectedMediaFile.name.split('.').pop()!.toUpperCase();

        const mediaWrapper = new MediaWrapper(
            new CreateMedia(
                // Index will later be set based on array index of item
                0,
                fileExtension
            ),
            [],
            this.selectedMediaFile,
            this.selectedThumbnailFile
        )

        this.store.dispatch(addMedia({
            mediaWrapper
        }));
    }

}
