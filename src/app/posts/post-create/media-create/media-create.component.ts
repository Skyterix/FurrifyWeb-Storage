import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {PostCreateService} from "../post-create.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MediaWrapper} from "../../store/posts.reducer";
import {Store} from "@ngrx/store";
import * as fromApp from "../../../store/app.reducer";
import {addMedia} from "../../store/posts.actions";
import {CreateMedia} from "../../../shared/model/request/create-media.model";
import {faUpload} from "@fortawesome/free-solid-svg-icons/faUpload";

@Component({
    selector: 'app-media-create',
    templateUrl: './media-create.component.html',
    styleUrls: ['./media-create.component.css']
})
export class MediaCreateComponent implements OnInit {

    @ViewChild('article', {read: ElementRef}) articleRef!: ElementRef;

    uploadIcon = faUpload;

    addFileForm: FormGroup;
    selectedFile!: File;

    constructor(private postCreateService: PostCreateService,
                private store: Store<fromApp.AppState>,
                private renderer: Renderer2) {
        // Add file form
        this.addFileForm = new FormGroup({
            mediaFile: new FormControl(null, [Validators.required])
        });
    }

    ngOnInit(): void {
    }

    onClose(): void {
        this.renderer.addClass(this.articleRef.nativeElement, "animate__fadeOut");

        // Let the animation finish
        setTimeout(() => {
            this.postCreateService.mediaCreateCloseEvent.emit();
        }, 100);
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

        const mediaWrapper = new MediaWrapper(
            new CreateMedia(
                // Index will later be set based on array index of item
                0,
                fileExtension,
                []
            ),
            this.selectedFile
        )

        this.store.dispatch(addMedia({
            mediaWrapper
        }));
    }

}
