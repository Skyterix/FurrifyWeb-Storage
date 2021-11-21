import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PostCreateService} from "../post-create.service";
import {Store} from "@ngrx/store";
import * as fromApp from "../../../store/app.reducer";
import {AttachmentWrapper} from "../../store/posts.reducer";
import {addAttachment} from "../../store/posts.actions";
import {CreateAttachment} from "../../../shared/model/request/create-attachment.model";
import {faUpload} from "@fortawesome/free-solid-svg-icons/faUpload";

@Component({
    selector: 'app-attachment-create',
    templateUrl: './attachment-create.component.html',
    styleUrls: ['./attachment-create.component.css']
})
export class AttachmentCreateComponent implements OnInit {

    uploadIcon = faUpload;

    addFileForm: FormGroup;
    selectedFile!: File;

    constructor(private postCreateService: PostCreateService,
                private store: Store<fromApp.AppState>) {
        // Add file form
        this.addFileForm = new FormGroup({
            attachmentFile: new FormControl(null, [Validators.required])
        });
    }

    ngOnInit(): void {
    }

    onClose(): void {
        this.postCreateService.attachmentCreateCloseEvent.emit();
    }

    onFileSelected(event: any): void {
        if (event.target.files.length > 0) {
            this.selectedFile = event.target.files[0];
        }
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
