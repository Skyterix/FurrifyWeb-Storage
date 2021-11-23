import {Component, OnDestroy, OnInit} from '@angular/core';
import {AttachmentWrapper, MediaWrapper} from "../../store/posts.reducer";
import {PostCreateService} from "../post-create.service";
import {Store} from "@ngrx/store";
import * as fromApp from "../../../store/app.reducer";
import {Subscription} from "rxjs";
import {removeAttachment, removeMedia, updateMediaSet} from "../../store/posts.actions";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
    selector: 'app-post-create-content-step',
    templateUrl: './post-create-content-step.component.html',
    styleUrls: ['./post-create-content-step.component.css']
})
export class PostCreateContentStepComponent implements OnInit, OnDestroy {

    mediaSet: MediaWrapper[] = [];
    attachments: AttachmentWrapper[] = [];

    private postsStoreSubscription!: Subscription;

    constructor(private postCreateService: PostCreateService,
                private store: Store<fromApp.AppState>) {
    }

    ngOnInit(): void {
        this.postsStoreSubscription = this.store.select('posts').subscribe(state => {
            this.mediaSet = state.mediaSet;
            this.attachments = state.attachments;
        });
    }

    ngOnDestroy(): void {
        this.postsStoreSubscription.unsubscribe();
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
