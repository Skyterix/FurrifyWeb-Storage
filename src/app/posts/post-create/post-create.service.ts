import {EventEmitter, Injectable} from '@angular/core';
import {PostCreateStatusEnum} from "../../shared/enum/post-create-status.enum";
import {Store} from "@ngrx/store";
import * as fromApp from "../../store/app.reducer";
import {KeycloakProfile} from "keycloak-js";
import {ArtistWrapper, AttachmentWrapper, MediaWrapper, TagWrapper, WrapperStatus} from "./store/post-create.reducer";
import {
    createAttachmentsSourcesStart,
    createAttachmentsStart,
    createMediaSetSourcesStart,
    createMediaSetStart,
    createPostStart
} from "./store/post-create.actions";

@Injectable({
    providedIn: 'root'
})
export class PostCreateService {

    postCreateOpenEvent: EventEmitter<void> = new EventEmitter<void>();
    clearPostCreateModalEvent: EventEmitter<void> = new EventEmitter<void>();

    clearPostCreateSideStepModalEvent: EventEmitter<void> = new EventEmitter<void>();

    tagCreateOpenEvent: EventEmitter<string> = new EventEmitter<string>();
    artistCreateOpenEvent: EventEmitter<string> = new EventEmitter<string>();
    mediaCreateOpenEvent: EventEmitter<void> = new EventEmitter<void>();
    attachmentCreateOpenEvent: EventEmitter<void> = new EventEmitter<void>();
    mediaSourceCreateOpenEvent: EventEmitter<MediaWrapper> = new EventEmitter<MediaWrapper>();
    attachmentSourceCreateOpenEvent: EventEmitter<AttachmentWrapper> = new EventEmitter<AttachmentWrapper>();
    artistSourceCreateOpenEvent: EventEmitter<ArtistWrapper> = new EventEmitter<ArtistWrapper>();

    postInfoStepOpenEvent: EventEmitter<void> = new EventEmitter<void>();
    postContentStepOpenEvent: EventEmitter<void> = new EventEmitter<void>();
    postUploadStepOpenEvent: EventEmitter<void> = new EventEmitter<void>();

    postCreateStatusChangeEvent: EventEmitter<PostCreateStatusEnum> = new EventEmitter<PostCreateStatusEnum>();

    private title!: string;
    private description!: string;
    private artists!: ArtistWrapper[];
    private tags!: TagWrapper[];
    private mediaSet!: MediaWrapper[];
    private attachments!: AttachmentWrapper[];
    private currentUser!: KeycloakProfile | null;

    private currentStatus: PostCreateStatusEnum | undefined;

    private createdPostId!: string;

    private currentIndex!: number;
    private currentSourceIndex!: number;

    constructor(private store: Store<fromApp.AppState>) {
        this.store.select('postCreate').subscribe(state => {
            this.title = state.postSavedTitle;
            this.description = state.postSavedDescription;
            this.artists = state.selectedArtists;
            this.tags = state.selectedTags;
            this.mediaSet = state.mediaSet;
            this.attachments = state.attachments;

            this.currentIndex = state.currentIndex;
            this.currentSourceIndex = state.currentSourceIndex;

            this.createdPostId = state.createdPostId;
        });

        this.store.select('authentication').subscribe(state => {
            this.currentUser = state.currentUser;
        });

        this.postCreateStatusChangeEvent.subscribe(status =>
            this.handlePostCreateStatusChange(status, 0, 0));
    }

    retryPostCreate(): void {
        if (!this.currentStatus) {
            return;
        }

        this.handlePostCreateStatusChange(
            this.currentStatus,
            this.currentIndex,
            this.currentSourceIndex
        );
    }

    isFormDataValid(): boolean {
        // Is title present
        if (!this.title) {
            return false;
        }

        // Is at least one tag present
        if (this.tags.length === 0) {
            return false;
        }

        // If some tag is not created or not yet fetched
        if (!!this.tags.find(tag => tag.status === WrapperStatus.NOT_FOUND || tag.status === WrapperStatus.NOT_QUERIED)) {
            return false;
        }

        // Is at least one artist present
        if (this.artists.length === 0) {
            return false;
        }

        // If some artist is not created or not yet fetched
        if (!!this.artists.find(artist => artist.status === WrapperStatus.NOT_FOUND || artist.status === WrapperStatus.NOT_QUERIED)) {
            return false;
        }

        // Is media or attachment present
        if (!(this.mediaSet.length !== 0 || this.attachments.length !== 0)) {
            return false;
        }

        return true;
    }

    triggerPostCreate(): void {
        this.postCreateStatusChangeEvent.emit(PostCreateStatusEnum.REQUEST_RECEIVED);
    }

    private handlePostCreateStatusChange(status: PostCreateStatusEnum,
                                         currentIndex: number,
                                         currentSourceIndex: number) {
        this.currentStatus = status;

        switch (status) {
            case PostCreateStatusEnum.REQUEST_RECEIVED:
                this.createPost();
                break;
            case PostCreateStatusEnum.POST_CREATED:
                this.uploadMediaSet(currentIndex);
                break;
            case PostCreateStatusEnum.MEDIA_SET_UPLOADED:
                this.uploadAttachments(currentIndex);
                break;
            case PostCreateStatusEnum.ATTACHMENTS_UPLOADED:
                this.createMediaSetSources(currentIndex, currentSourceIndex);
                break;
            case PostCreateStatusEnum.MEDIA_SET_SOURCES_CREATED:
                this.createAttachmentsSources(currentIndex, currentSourceIndex);
                break;
        }
    }

    private createPost(): void {
        if (!this.currentUser || !this.isFormDataValid()) {
            return;
        }

        const createPost = {
            title: this.title,
            description: this.description,
            artists: this.artists.map(artistWrapper => artistWrapper.artist),
            tags: this.tags.map(tagWrapper => tagWrapper.tag)
        }

        this.store.dispatch(createPostStart(
            {
                userId: this.currentUser?.id!,
                createPost,
                mediaSet: this.mediaSet,
                attachments: this.attachments
            }
        ))
    }

    private uploadMediaSet(startIndex: number): void {
        this.store.dispatch(createMediaSetStart(
            {
                userId: this.currentUser?.id!,
                postId: this.createdPostId,
                mediaSet: this.mediaSet,
                currentIndex: startIndex
            }
        ))
    }

    private uploadAttachments(startIndex: number): void {
        this.store.dispatch(createAttachmentsStart(
            {
                userId: this.currentUser?.id!,
                postId: this.createdPostId,
                attachments: this.attachments,
                currentIndex: startIndex
            }
        ))
    }

    private createMediaSetSources(startMediaIndex: number, startSourceIndex: number): void {
        this.store.dispatch(createMediaSetSourcesStart(
            {
                userId: this.currentUser?.id!,
                postId: this.createdPostId,
                mediaSet: this.mediaSet,
                currentMediaIndex: startMediaIndex,
                currentSourceIndex: startSourceIndex
            }
        ))
    }

    private createAttachmentsSources(startMediaIndex: number, startSourceIndex: number): void {
        this.store.dispatch(createAttachmentsSourcesStart(
            {
                userId: this.currentUser?.id!,
                postId: this.createdPostId,
                attachments: this.attachments,
                currentAttachmentIndex: startMediaIndex,
                currentSourceIndex: startSourceIndex
            }
        ))
    }
}
