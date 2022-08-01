import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostCreateService} from "../post-create.service";
import {Store} from "@ngrx/store";
import * as fromApp from "../../../store/app.reducer";
import {Subscription} from "rxjs";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {
    removeAttachment,
    removeAttachmentFromPostStart,
    removeMedia,
    removeMediaFromPostStart,
    updateMediaSet
} from "../store/post-create.actions";
import {AttachmentWrapper, MediaWrapper, WrapperSourcesFetchingStatus} from "../store/post-create.reducer";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons";
import {ActivatedRoute} from "@angular/router";
import {KeycloakProfile} from "keycloak-js";

@Component({
    selector: 'app-post-create-content-step',
    templateUrl: './post-create-content-step.component.html',
    styleUrls: ['./post-create-content-step.component.css']
})
export class PostCreateContentStepComponent implements OnInit, OnDestroy {

    spinnerIcon = faCircleNotch;

    mediaSet: MediaWrapper[] = [];
    attachments: AttachmentWrapper[] = [];

    postEditMode = false;

    isFetching = false;

    readonly WrapperSourcesFetchingStatus = WrapperSourcesFetchingStatus;

    private currentPostId!: string | undefined;
    private currentUser!: KeycloakProfile | null;

    private postCreateStoreSubscription!: Subscription;
    private authenticationStoreSubscription!: Subscription;

    constructor(private postCreateService: PostCreateService,
                private store: Store<fromApp.AppState>,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.authenticationStoreSubscription = this.store.select('authentication').subscribe(state => {
            this.currentUser = state.currentUser;
        });

        this.postCreateStoreSubscription = this.store.select('postCreate').subscribe(state => {
            this.mediaSet = state.mediaSet;
            this.attachments = state.attachments;
            this.currentPostId = state.savedPostId;
            this.isFetching = state.currentlyFetchingCount > 0;
        });

        this.activatedRoute.queryParams.subscribe(queryParams => {
            this.postEditMode = queryParams.edit === 'true';
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
        if (this.isFetching) {
            return;
        }

        // If in post edit mode and current media already exists
        if (this.postEditMode && this.mediaSet[index].mediaId !== undefined) {
            this.store.dispatch(removeMediaFromPostStart({
                userId: this.currentUser!.id!,
                postId: this.currentPostId!,
                mediaId: this.mediaSet[index].mediaId!
            }));

            return;
        }

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
        if (this.isFetching) {
            return;
        }

        // If in post edit mode and current attachment already exists
        if (this.postEditMode && this.attachments[index].attachmentId !== undefined) {
            this.store.dispatch(removeAttachmentFromPostStart({
                userId: this.currentUser!.id!,
                postId: this.currentPostId!,
                attachmentId: this.attachments[index].attachmentId!
            }));

            return;
        }

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
