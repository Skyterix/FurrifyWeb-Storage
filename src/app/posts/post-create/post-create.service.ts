import {EventEmitter, Injectable} from '@angular/core';
import {PostCreateStatusEnum} from "../../shared/enum/post-create-status.enum";
import {Store} from "@ngrx/store";
import * as fromApp from "../../store/app.reducer";
import {KeycloakProfile} from "keycloak-js";
import {ArtistWrapper, AttachmentWrapper, MediaWrapper, TagWrapper, WrapperStatus} from "./store/post-create.reducer";
import {
    clearPostData,
    createAttachmentsSourcesStart,
    createAttachmentsStart,
    createMediaSetSourcesStart,
    createMediaSetStart,
    createPostStart,
    replaceMediaSetStart,
    savePostStart
} from "./store/post-create.actions";
import {QueryPost} from "../../shared/model/query/query-post.model";
import {ReplacePost} from "../../shared/model/request/replace-post.model";
import {CreatePost} from "../../shared/model/request/create-post.model";
import {PostSaveStatusEnum} from "../../shared/enum/post-save-status.enum";
import {PostsService} from "../posts.service";

@Injectable({
    providedIn: 'root'
})
export class PostCreateService {

    postCreateOpenEvent: EventEmitter<void> = new EventEmitter<void>();
    postEditOpenEvent: EventEmitter<QueryPost> = new EventEmitter<QueryPost>();
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

    // Create
    postCreateStatusChangeEvent: EventEmitter<PostCreateStatusEnum> = new EventEmitter<PostCreateStatusEnum>();
    // Edit
    postSaveStatusChangeEvent: EventEmitter<PostSaveStatusEnum> = new EventEmitter<PostSaveStatusEnum>();

    private title!: string;
    private description!: string;
    private artists!: ArtistWrapper[];
    private tags!: TagWrapper[];
    private mediaSet!: MediaWrapper[];
    private attachments!: AttachmentWrapper[];
    private currentUser!: KeycloakProfile | null;

    private currentCreateStatus: PostCreateStatusEnum | undefined;
    private currentSaveStatus: PostSaveStatusEnum | undefined;

    private savedPostId!: string;

    private currentIndex!: number;
    private currentSourceIndex!: number;

    constructor(private store: Store<fromApp.AppState>, private postsService: PostsService) {
        this.store.select('postCreate').subscribe(state => {
            this.title = state.postSavedTitle;
            this.description = state.postSavedDescription;
            this.artists = state.selectedArtists;
            this.tags = state.selectedTags;
            this.mediaSet = state.mediaSet;
            this.attachments = state.attachments;

            this.currentIndex = state.currentIndex;
            this.currentSourceIndex = state.currentSourceIndex;

            this.savedPostId = state.savedPostId;
        });

        this.store.select('authentication').subscribe(state => {
            this.currentUser = state.currentUser;
        });

        this.postCreateStatusChangeEvent.subscribe(status =>
            // Reset index counter on status change
            this.handlePostCreateStatusChange(status, 0, 0));

        this.postSaveStatusChangeEvent.subscribe(status =>
            // Reset index counter on status change
            this.handlePostEditStatusChange(status, 0, 0));
    }

    retryPostCreate(): void {
        if (!this.currentCreateStatus) {
            return;
        }

        this.handlePostCreateStatusChange(
            this.currentCreateStatus,
            this.currentIndex,
            this.currentSourceIndex
        );
    }

    retryPostSave(): void {
        if (!this.currentSaveStatus) {
            return;
        }

        this.handlePostEditStatusChange(
            this.currentSaveStatus,
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


    triggerPostSave(): void {
        this.postSaveStatusChangeEvent.emit(PostSaveStatusEnum.REQUEST_RECEIVED);
    }

    clearPostData(): void {
        this.currentCreateStatus = undefined;
        this.currentSaveStatus = undefined;

        this.store.dispatch(clearPostData());
    }

    private handlePostEditStatusChange(status: PostSaveStatusEnum,
                                       currentIndex: number,
                                       currentSourceIndex: number) {
        this.currentSaveStatus = status;

        switch (status) {
            case PostSaveStatusEnum.REQUEST_RECEIVED:
                this.savePost();

                break;
            case PostSaveStatusEnum.POST_UPDATED:
                this.replaceMediaSet(currentIndex);
                break;
            case PostSaveStatusEnum.MEDIA_UPDATED: // TODO
            case PostSaveStatusEnum.ATTACHMENTS_UPDATED: //TODO
            case PostSaveStatusEnum.MEDIA_SOURCES_REPLACED: //TODO
            case PostSaveStatusEnum.ATTACHMENT_SOURCES_REPLACED: //TODO
                // TODO Move this to effects
                setTimeout(() => {
                    this.clearPostCreateModalEvent.emit();
                    // Replace post with new one
                    // TODO Make this use values in store instead of fetching cause post might have not been updated yet or think of other solution
                    this.postsService.loadPost(this.currentUser?.id!, this.savedPostId);
                    this.clearPostData();
                }, 100);
                break;
        }
    }


    private handlePostCreateStatusChange(status: PostCreateStatusEnum,
                                         currentIndex: number,
                                         currentSourceIndex: number) {
        this.currentCreateStatus = status;

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
            case PostCreateStatusEnum.MEDIA_SET_SOURCES_CREATED:
                this.createAttachmentsSources(currentIndex, currentSourceIndex);
                break;
            case PostCreateStatusEnum.ATTACHMENTS_UPLOADED:
                this.createMediaSetSources(currentIndex, currentSourceIndex);

                setTimeout(() => {
                    this.clearPostCreateModalEvent.emit();
                    this.clearPostData();
                    this.postsService.triggerSearch()
                }, 100);

                break;
        }
    }

    private createPost(): void {
        if (!this.currentUser || !this.isFormDataValid()) {
            return;
        }

        const createPost: CreatePost = {
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

    // Save post after edit
    private savePost(): void {
        if (!this.currentUser || !this.isFormDataValid()) {
            return;
        }

        const savePost: ReplacePost = {
            title: this.title,
            description: this.description,
            artists: this.artists.map(artistWrapper => artistWrapper.artist),
            tags: this.tags.map(tagWrapper => tagWrapper.tag)
        }

        this.store.dispatch(savePostStart(
            {
                userId: this.currentUser?.id!,
                postId: this.savedPostId,
                savePost
            }
        ))
    }

    private replaceMediaSet(startIndex: number): void {
        this.store.dispatch(replaceMediaSetStart(
            {
                userId: this.currentUser?.id!,
                postId: this.savedPostId,
                mediaSet: this.mediaSet,
                currentIndex: startIndex
            }
        ))
    }

    private uploadMediaSet(startIndex: number): void {
        this.store.dispatch(createMediaSetStart(
            {
                userId: this.currentUser?.id!,
                postId: this.savedPostId,
                mediaSet: this.mediaSet,
                currentIndex: startIndex
            }
        ))
    }

    private uploadAttachments(startIndex: number): void {
        this.store.dispatch(createAttachmentsStart(
            {
                userId: this.currentUser?.id!,
                postId: this.savedPostId,
                attachments: this.attachments,
                currentIndex: startIndex
            }
        ))
    }

    private createMediaSetSources(startMediaIndex: number, startSourceIndex: number): void {
        this.store.dispatch(createMediaSetSourcesStart(
            {
                userId: this.currentUser?.id!,
                postId: this.savedPostId,
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
                postId: this.savedPostId,
                attachments: this.attachments,
                currentAttachmentIndex: startMediaIndex,
                currentSourceIndex: startSourceIndex
            }
        ))
    }
}
