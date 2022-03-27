import {EventEmitter, Injectable} from '@angular/core';
import {ArtistWrapper, AttachmentWrapper, MediaWrapper, TagWrapper} from "../store/posts.reducer";
import {PostCreateStatusEnum} from "../../shared/enum/post-create-status.enum";
import {Store} from "@ngrx/store";
import * as fromApp from "../../store/app.reducer";
import {
    createAttachmentsSourcesStart,
    createAttachmentsStart,
    createMediaSetSourcesStart,
    createMediaSetStart,
    createPostStart
} from "../store/posts.actions";
import {KeycloakProfile} from "keycloak-js";

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

    private createdPostId!: string;

    constructor(private store: Store<fromApp.AppState>) {
        this.store.select('posts').subscribe(state => {
            this.title = state.postSavedTitle;
            this.description = state.postSavedDescription;
            this.artists = state.selectedArtists;
            this.tags = state.selectedTags;
            this.mediaSet = state.mediaSet;
            this.attachments = state.attachments;

            this.createdPostId = state.createdPostId;
        });

        this.store.select('authentication').subscribe(state => {
            this.currentUser = state.currentUser;
        });

        this.postCreateStatusChangeEvent.subscribe(status => {
            switch (status) {
                case PostCreateStatusEnum.POST_CREATED:
                    this.uploadMediaSet();
                    break;
                case PostCreateStatusEnum.MEDIA_SET_UPLOADED:
                    this.uploadAttachments();
                    break;
                case PostCreateStatusEnum.ATTACHMENTS_UPLOADED:
                    this.createMediaSetSources();
                    break;
                case PostCreateStatusEnum.MEDIA_SET_SOURCES_CREATED:
                    this.createAttachmentsSources();
                    break;
            }
        });
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

        // If some tag is not created
        if (!!this.tags.find(tag => !tag.isExisting)) {
            return false;
        }

        // Is at least one artist present
        if (this.artists.length === 0) {
            return false;
        }

        // If some tag is not created
        if (!!this.artists.find(artist => !artist.isExisting)) {
            return false;
        }

        // Is media or attachment present
        if (!(this.mediaSet.length !== 0 || this.attachments.length !== 0)) {
            return false;
        }

        return true;
    }

    createPost(): void {
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

    private uploadMediaSet(): void {
        this.store.dispatch(createMediaSetStart(
            {
                userId: this.currentUser?.id!,
                postId: this.createdPostId,
                mediaSet: this.mediaSet,
                currentIndex: 0
            }
        ))
    }

    private uploadAttachments(): void {
        this.store.dispatch(createAttachmentsStart(
            {
                userId: this.currentUser?.id!,
                postId: this.createdPostId,
                attachments: this.attachments,
                currentIndex: 0
            }
        ))
    }

    private createMediaSetSources(): void {
        this.store.dispatch(createMediaSetSourcesStart(
            {
                userId: this.currentUser?.id!,
                postId: this.createdPostId,
                mediaSet: this.mediaSet,
                currentMediaIndex: 0,
                currentSourceIndex: 0
            }
        ))
    }

    private createAttachmentsSources(): void {
        this.store.dispatch(createAttachmentsSourcesStart(
            {
                userId: this.currentUser?.id!,
                postId: this.createdPostId,
                attachments: this.attachments,
                currentAttachmentIndex: 0,
                currentSourceIndex: 0
            }
        ))
    }
}
