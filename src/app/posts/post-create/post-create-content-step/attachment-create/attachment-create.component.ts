import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PostCreateService} from "../../post-create.service";
import {Store} from "@ngrx/store";
import * as fromApp from "../../../../store/app.reducer";
import {CreateAttachment} from "../../../../shared/model/request/create-attachment.model";
import {faUpload} from "@fortawesome/free-solid-svg-icons/faUpload";
import {EXTENSION_EXTRACT_REGEX, FILENAME_REGEX} from "../../../../shared/config/common.constats";
import {AttachmentExtensionsConfig} from "../../../../shared/config/attachment-extensions.config";
import {AttachmentWrapper} from "../../store/post-create.reducer";
import {addAttachment} from "../../store/post-create.actions";
import {MAX_FILENAME_LENGTH} from "../../../../shared/config/files.constants";

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

    private static defaultPickerLabel = "Select attachment file";
    private static filePickerDropLabel = "Drop file to attach";
    filePickerLabel = AttachmentCreateComponent.defaultPickerLabel;

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
            this.postCreateService.clearPostCreateSideStepModalEvent.emit();
        }, 100);
    }

    onFileSelected(event: any) {
        this.selectAttachmentFiles(event.target.files);
    }

    selectAttachmentFiles(files: File[]): void {
        this.errorMessage = "";

        // If file is not selected
        if (files.length === 0) {
            return;
        }

        // Is filename is invalid
        if (!FILENAME_REGEX.test(files[0].name)) {
            this.errorMessage = "File \"" + files[0].name + "\" has invalid name."

            this.addFileForm.reset();

            return;
        }

        if (files[0].name.length > MAX_FILENAME_LENGTH) {
            this.errorMessage = "File \"" + files[0].name + "\" has too long filename."

            this.addFileForm.reset();

            return;
        }

        const extension = EXTENSION_EXTRACT_REGEX.exec(files[0].name);

        /* Check extension against accepted extensions list.
           The check for null is not required, regex check above ensures that extension must be present. */
        if (!AttachmentExtensionsConfig.EXTENSIONS.includes(extension![1].toLowerCase())) {
            this.errorMessage = "File \"" + files[0].name + "\" has extension which is not accepted as attachment."

            this.addFileForm.reset();

            return;
        }

        this.selectedFile = files[0];
        this.filePickerLabel = files[0].name;
    }

    onFileDrop(event: any): void {
        event.preventDefault();

        this.selectAttachmentFiles(event.dataTransfer.files);

        // Trigger drag leave manually because JS doesn't on drop
        this.onFileDragLeave();
    }

    onFileDragOver(event: any): void {
        event.preventDefault();
    }

    onFileDragEnter(): void {
        this.filePickerLabel = AttachmentCreateComponent.filePickerDropLabel;
    }

    onFileDragLeave(): void {
        // For media file
        if (!this.selectedFile) {
            this.filePickerLabel = AttachmentCreateComponent.defaultPickerLabel;
        } else {
            this.filePickerLabel = this.selectedFile.name;
        }
    }

    onSubmit(): void {
        if (!this.selectedFile) {
            return;
        }

        const fileExtension = AttachmentExtensionsConfig.PREFIX +
            this.selectedFile.name.split('.').pop()!.toUpperCase();

        const attachmentWrapper = new AttachmentWrapper(
            new CreateAttachment(
                fileExtension
            ),
            [],
            this.selectedFile
        )

        this.store.dispatch(addAttachment({
            attachmentWrapper
        }));
    }
}
