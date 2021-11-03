import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import * as fromApp from "../../../store/app.reducer";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons/faCircleNotch";
import {ArtistWrapper, AttachmentWrapper, MediaWrapper, TagWrapper} from "../../store/posts.reducer";
import {createPostStart} from "../../store/posts.actions";
import {KeycloakProfile} from "keycloak-js";

@Component({
    selector: 'app-post-create-upload-step',
    templateUrl: './post-create-upload-step.component.html',
    styleUrls: ['./post-create-upload-step.component.css']
})
export class PostCreateUploadStepComponent implements OnInit, OnDestroy {

    spinnerIcon = faCircleNotch;

    errorMessage!: string;
    isFetching!: boolean;
    isFormValid = false;

    title!: string;
    description!: string;
    artists!: ArtistWrapper[];
    tags!: TagWrapper[];
    mediaSet!: MediaWrapper[];
    attachments!: AttachmentWrapper[];

    currentUser!: KeycloakProfile | null;

    currentMediaUploadIndex = 0;
    currentAttachmentUploadIndex = 0;

    private postsStoreSubscription!: Subscription;
    private authenticationStoreSubscription!: Subscription;

    constructor(private store: Store<fromApp.AppState>) {
    }

    ngOnInit(): void {
        this.postsStoreSubscription = this.store.select('posts').subscribe(state => {
            this.isFetching = state.isFetching;
            this.errorMessage = state.postCreateErrorMessage;

            this.title = state.postSavedTitle;
            this.description = state.postSavedDescription;
            this.artists = state.selectedArtists;
            this.tags = state.selectedTags;
            this.mediaSet = state.mediaSet;
            this.attachments = state.attachments;

            this.currentMediaUploadIndex = state.currentMediaUploadIndex;
            this.currentAttachmentUploadIndex = state.currentAttachmentUploadIndex;

            this.isFormValid = (
                !state.postSavedTitle || // Is title present
                state.selectedTags.length === 0 || // Is at least one tag present
                state.selectedArtists.length === 0 || // Is at least one artist present
                !(state.mediaSet.length !== 0 || state.attachments.length !== 0) // Is media or attachment present
            );
        });
        this.authenticationStoreSubscription = this.store.select('authentication').subscribe(state => {
            this.currentUser = state.currentUser;
        });

    }

    ngOnDestroy(): void {
        this.postsStoreSubscription.unsubscribe();
    }

    onSubmit(): void {
        if (this.isFetching || this.isFormValid) {
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
}
