import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostCreateService} from "../post-create.service";
import {Store} from "@ngrx/store";
import * as fromApp from "../../../store/app.reducer";
import {Subscription} from "rxjs";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {removeAttachment, removeMedia, updateMediaSet} from "../store/post-create.actions";
import {AttachmentWrapper, MediaWrapper} from "../store/post-create.reducer";

@Component({
    selector: 'app-post-create-content-step',
    templateUrl: './post-create-content-step.component.html',
    styleUrls: ['./post-create-content-step.component.css']
})
export class PostCreateContentStepComponent implements OnInit, OnDestroy {

    mediaSet: MediaWrapper[] = [];
    attachments: AttachmentWrapper[] = [];

    private postCreateStoreSubscription!: Subscription;

    constructor(private postCreateService: PostCreateService,
                private store: Store<fromApp.AppState>) {
    }

    ngOnInit(): void {
        this.postCreateStoreSubscription = this.store.select('postCreate').subscribe(state => {
            this.mediaSet = state.mediaSet;
            this.attachments = state.attachments;
        });
    }

    ngOnDestroy(): void {
        this.postCreateStoreSubscription.unsubscribe();
    }

    loadCreateMediaForm(): void {
        this.postCreateService.mediaCreateOpenEvent.emit();
    }

    loadCreateAttachmentForm(): void {
        this.postCreateService.attachmentCreateOpenEvent.emit();
    }

    onMediaRemove(index: number): void {
        this.store.dispatch(removeMedia({
            index
        }));
    }


    loadCreateMediaSourceForm(media: MediaWrapper) {
        this.postCreateService.mediaSourceCreateOpenEvent.emit(media);
    }

    loadCreateAttachmentSourceForm(attachment: AttachmentWrapper) {
        this.postCreateService.attachmentSourceCreateOpenEvent.emit(attachment);
    }

    onAttachmentRemove(index: number): void {
        this.store.dispatch(removeAttachment({
            index
        }));
    }

    dropMediaItem(event: CdkDragDrop<string[]>): void {
        let newMediaSet = [...this.mediaSet];

        moveItemInArray(newMediaSet, event.previousIndex, event.currentIndex);

        this.store.dispatch(updateMediaSet({
            mediaSet: newMediaSet
        }));
    }
    onNextStep(): void {
        if (this.mediaSet.length == 0) {
            return;
        }

        this.postCreateService.postUploadStepOpenEvent.emit();
    }
}
