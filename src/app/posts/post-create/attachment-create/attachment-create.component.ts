import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PostCreateService} from "../post-create.service";
import {Store} from "@ngrx/store";
import * as fromApp from "../../../store/app.reducer";
import {AttachmentWrapper} from "../../store/posts.reducer";
import {addAttachment} from "../../store/posts.actions";
import {CreateAttachment} from "../../../shared/model/request/create-attachment.model";
import {faUpload} from "@fortawesome/free-solid-svg-icons/faUpload";
import {EXTENSION_EXTRACT_REGEX, FILENAME_REGEX} from "../../../shared/config/common.constats";
import {AttachmentExtensionsConfig} from "../../../shared/config/attachment-extensions.config";

@Component({
    selector: 'app-attachment-create',
    templateUrl: './attachment-create.component.html',
    styleUrls: ['./attachment-create.component.css']
})
export class AttachmentCreateComponent implements OnInit {

    @ViewChild('article', {read: ElementRef}) articleRef!: ElementRef;

    uploadIcon = faUpload;

    addFileForm: FormGroup;
    selectedFile!: File;
    errorMessage!: string;

    constructor(private postCreateService: PostCreateService,
                private store: Store<fromApp.AppState>,
                private renderer: Renderer2) {
        // Add file form
        this.addFileForm = new FormGroup({
            attachmentFile: new FormControl(null, [Validators.required])
        });
    }

    ngOnInit(): void {
    }

    onClose(): void {
        this.renderer.addClass(this.articleRef.nativeElement, "animate__fadeOut");

        // Let the animation finish
        setTimeout(() => {
            this.postCreateService.attachmentCreateCloseEvent.emit();
        }, 100);
    }

    onFileSelected(event: any): void {
        this.errorMessage = "";

        // If file is not selected
        if (event.target.files.length === 0) {
            return;
        }

        // Is filename is invalid
        if (!FILENAME_REGEX.test(event.target.files[0].name)) {
            this.errorMessage = "File \"" + event.target.files[0].name + "\" has invalid name."

            this.addFileForm.reset();
        }

        const extension = EXTENSION_EXTRACT_REGEX.exec(event.target.files[0].name);

        /* Check extension against accepted extensions list.
           The check for null is not required, regex check above ensures that extension must be present. */
        if (!AttachmentExtensionsConfig.EXTENSIONS.includes(extension![1])) {
            this.errorMessage = "File \"" + event.target.files[0].name + "\" has extension which is not accepted as attachment."

            this.addFileForm.reset();
        }

        this.selectedFile = event.target.files[0];
    }

    onSubmit(): void {
        if (!this.selectedFile) {
            return;
        }

        const fileExtension = this.selectedFile.name.split('.').pop()!.toUpperCase();

        const attachmentWrapper = new AttachmentWrapper(
            new CreateAttachment(
                fileExtension,
                []
            ),
            this.selectedFile
        )

        this.store.dispatch(addAttachment({
            attachmentWrapper
        }));
    }
}
