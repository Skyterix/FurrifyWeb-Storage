import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Media} from "../../../shared/model/media.model";
import {MediaUtils} from "../../../shared/util/media.utils";
import {Store} from "@ngrx/store";
import * as fromApp from "../../../store/app.reducer";
import {ActivatedRoute, Router} from "@angular/router";
import {CDN_ADDRESS} from "../../../shared/config/api.constants";
import {QueryPost} from "../../../shared/model/query/query-post.model";
import {MediaType} from "../../../shared/enum/media-type.enum";
import {MediaExtensionsConfig} from "../../../shared/config/media-extensions.config";
import {MediaIconsConfig} from "../../../shared/config/media-icons.config";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {KeycloakService} from "keycloak-angular";
import {PostsService} from "../../posts.service";
import {ConfirmationsService} from "../../../shared/component/confirmations/confirmations.service";
import {QuerySource} from "../../../shared/model/query/query-source.model";
import {getPostAttachmentsSourcesStart} from "../../store/posts.actions";
import {Subscription} from "rxjs";
import {KeycloakProfile} from "keycloak-js";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons/faCircleNotch";

@Component({
    selector: 'app-post-items',
    templateUrl: './post-items.component.html',
    styleUrls: ['./post-items.component.css']
})
export class PostItemsComponent implements OnInit, OnDestroy {
    @Input() post!: QueryPost;

    circleNotchIcon = faCircleNotch;

    sortedMedia!: Media[];

    cdnAddress = CDN_ADDRESS;
    fileUrl!: string;

    attachmentSources: QuerySource[][] = [];

    currentIndex!: number;

    areAttachmentsSourcesFetching!: boolean;

    private authenticationStoreSubscription!: Subscription;
    private postsStoreSubscription!: Subscription;

    private currentUser!: KeycloakProfile | null;

    constructor(private store: Store<fromApp.AppState>,
                private confirmationsService: ConfirmationsService,
                private postsService: PostsService,
                private keycloakService: KeycloakService,
                private activatedRoute: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        this.sortedMedia = MediaUtils.sortByPriority([...this.post.mediaSet]);

        this.activatedRoute.params.subscribe(params => {
            this.currentIndex = params.index;

            // Null check
            if (!!this.sortedMedia[params.index]) {
                this.fileUrl = CDN_ADDRESS + this.sortedMedia[params.index].fileUri;
            }
        });

        this.authenticationStoreSubscription = this.store.select('authentication').subscribe(state => {
            this.currentUser = state.currentUser;
        });
        this.postsStoreSubscription = this.store.select('posts').subscribe(state => {
            this.areAttachmentsSourcesFetching = state.areAttachmentSourcesFetching;
            this.attachmentSources = state.selectedPostAttachmentsSources;
        });

        setTimeout(() => this.loadAttachmentSources());
    }


    ngOnDestroy(): void {
        this.authenticationStoreSubscription.unsubscribe();
        this.postsStoreSubscription.unsubscribe();
    }

    onLoadMediaRequest(index: number): void {
        if (index == this.currentIndex) {
            return;
        }

        this.router.navigate(['/posts', this.post.postId, 'media', index], {
            queryParamsHandling: "merge"
        });
    }

    getIconFromMedia(index: number): IconDefinition {
        switch (MediaExtensionsConfig.getTypeByExtension(this.sortedMedia[index].extension)) {
            case MediaType.IMAGE:
                return MediaIconsConfig.IMAGE_ICON;
            case MediaType.VIDEO:
                return MediaIconsConfig.VIDEO_ICON;
            case MediaType.ANIMATION:
                return MediaIconsConfig.ANIMATION_ICON;
            case MediaType.AUDIO:
                return MediaIconsConfig.AUDIO_ICON;
            default:
                throw new Error("Media type is undefined.");
        }
    }

    // TODO Implement
    onEditPost(): void {
        alert("Not implemented yet.");
    }

    onDeletePost(): void {
        this.confirmationsService.postDeleteConfirmationOpenEvent.emit(this.post);
    }

    loadAttachmentSources(): void {
        // Load attachments sources
        this.store.dispatch(getPostAttachmentsSourcesStart({
            userId: this.currentUser!.id!,
            postId: this.post.postId,
            attachments: this.post.attachments,
            currentAttachmentsSources: [],
            currentIndex: 0
        }));
    }
}
