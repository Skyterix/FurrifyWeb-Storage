import {Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Tag} from "../../../shared/model/tag.model";
import {TagUtils} from "../../../shared/util/tag.utils";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons/faCircleNotch";
import {Media} from "../../../shared/model/media.model";
import {MediaUtils} from "../../../shared/util/media.utils";
import {Store} from "@ngrx/store";
import * as fromApp from "../../../store/app.reducer";
import {ActivatedRoute, Router} from "@angular/router";
import {CDN_ADDRESS} from "../../../shared/config/api.constants";
import {PostsService} from "../../posts.service";
import {QueryPost} from "../../../shared/model/query/query-post.model";
import * as PhotoSwipe from "photoswipe";
import * as PhotoSwipeUI_Default from "photoswipe/dist/photoswipe-ui-default";
import {MediaExtensionsConfig} from "../../../shared/config/media-extensions.config";
import {MediaType} from "../../../shared/enum/media-type.enum";
import {getPostMediaSourcesStart} from "../../store/posts.actions";
import {Subscription} from "rxjs";
import {KeycloakProfile} from "keycloak-js";
import {QuerySource} from "../../../shared/model/query/query-source.model";

declare var videojs: any;

@Component({
    selector: 'app-post-details',
    templateUrl: './post-details.component.html',
    styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit, OnDestroy {

    @Input() post!: QueryPost;

    @ViewChild('imageView', {read: ElementRef}) imageViewRef!: ElementRef;
    @ViewChild('videoView', {read: ElementRef}) videoViewRef!: ElementRef;
    @ViewChild('mediaSpinner', {read: ElementRef}) mediaSpinnerRef!: ElementRef;
    player: any;

    circleNotchIcon = faCircleNotch;

    index!: number;

    sortedTags!: Tag[];
    sortedMedia!: Media[];

    mediaSources!: QuerySource[];

    galleryItems: { src: string, w: number, h: number }[] = [];

    posterUrl!: string;

    areSourcesFetching!: boolean;

    private static GIF_MEDIA_EXTENSION: string = MediaExtensionsConfig.PREFIX + "GIF";

    private currentUser!: KeycloakProfile | null;

    private postsStoreSubscription!: Subscription;
    private authenticationStoreSubscription!: Subscription;

    constructor(private renderer: Renderer2,
                private postsService: PostsService,
                private store: Store<fromApp.AppState>,
                private activatedRoute: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        this.postsStoreSubscription = this.store.select('posts').subscribe(state => {
            this.mediaSources = state.selectedPostMediaSources;
            this.areSourcesFetching = state.areSourcesFetching;
        });

        this.authenticationStoreSubscription = this.store.select('authentication').subscribe(state => {
            this.currentUser = state.currentUser;
        });

        // Sort
        this.sortedTags = TagUtils.sortTagsByPriority([...this.post.tags]);
        this.sortedMedia = MediaUtils.sortByPriority([...this.post.mediaSet]);
        this.sortedMedia.forEach(media => {
            switch (MediaExtensionsConfig.getTypeByExtension(media.extension)) {
                case MediaType.ANIMATION:
                    // Only gif is supported in gallery
                    if (media.extension === PostDetailsComponent.GIF_MEDIA_EXTENSION) {
                        this.galleryItems.push({
                            src: CDN_ADDRESS + media.fileUri,
                            w: 0,
                            h: 0
                        });
                    }
                    break;

                case MediaType.IMAGE:
                    this.galleryItems.push({
                        src: CDN_ADDRESS + media.fileUri,
                        w: 0,
                        h: 0
                    });
                    break;
            }
        });

        // On index change
        this.activatedRoute.params.subscribe(params => {
            // Get selected media index from url
            this.index = +params.index;

            // If there is no media
            if (this.sortedMedia.length === 0) {
                return;
            }

            // If media exists in post and index is valid
            if (this.sortedMedia[this.index] !== undefined) {
                setTimeout(() => this.loadMedia(this.sortedMedia[this.index]));
            } else {
                this.router.navigate(['/posts', this.post.postId, 'media', 0]);
            }
        });
    }

    ngOnDestroy(): void {
        this.postsStoreSubscription.unsubscribe();
        this.authenticationStoreSubscription.unsubscribe();
    }

    onImageLoaded(): void {
        this.renderer.removeStyle(this.imageViewRef.nativeElement, 'display');
        this.renderer.removeStyle(this.mediaSpinnerRef.nativeElement, 'display');
    }

    searchPosts(): void {
        // Let router navigate first so search can be updated
        setTimeout(() => {
            this.postsService.triggerSearch();
        });
    }

    openImageGallery(): void {
        const galleryElement: HTMLElement = document.querySelector('.pswp')!;

        const options = {
            history: false,
            index: this.index,
            clickToCloseNonZoomable: false
        };

        const gallery = new PhotoSwipe(galleryElement, PhotoSwipeUI_Default, this.galleryItems, options);
        gallery.listen('gettingData', (index, item) => {
            if (item.w! < 1 || item.h! < 1) {
                const img = new Image();
                img.onload = function () {
                    // @ts-ignore
                    item.w = this.width;
                    // @ts-ignore
                    item.h = this.height;
                    gallery.invalidateCurrItems();
                    gallery.updateSize(true);
                };
                img.src = item.src!;
            }
        });
        gallery.init();
    }

    private loadMedia(media: Media): void {
        this.renderer.setStyle(this.imageViewRef.nativeElement, 'display', 'none');
        this.renderer.setStyle(this.videoViewRef.nativeElement, 'display', 'none');
        this.renderer.setStyle(this.mediaSpinnerRef.nativeElement, 'display', 'inline-block');

        const type = MediaExtensionsConfig.getTypeByExtension(media.extension);

        switch (type) {
            case MediaType.IMAGE:
                this.renderer.setAttribute(this.imageViewRef.nativeElement, 'src', CDN_ADDRESS + media.fileUri);

                break;
            case MediaType.ANIMATION:
                if (media.extension === PostDetailsComponent.GIF_MEDIA_EXTENSION) {
                    this.renderer.setAttribute(this.imageViewRef.nativeElement, 'src', CDN_ADDRESS + media.fileUri);
                }

                break;
            case MediaType.VIDEO:
            case MediaType.AUDIO:
                this.renderer.removeStyle(this.videoViewRef.nativeElement, 'display');

                this.posterUrl = (!media.thumbnailUri) ? "" : CDN_ADDRESS + media.thumbnailUri;

                // Check if player already exists
                if (!this.player) {
                    this.player = videojs(document.getElementById('audio-player'));
                }

                // Load video
                this.player.src({
                    src: CDN_ADDRESS + media.fileUri
                });
                this.player.poster(this.posterUrl);

                this.renderer.removeStyle(this.mediaSpinnerRef.nativeElement, 'display');

                break;
        }

        this.store.dispatch(getPostMediaSourcesStart({
            userId: this.currentUser!.id!,
            postId: this.post.postId,
            mediaId: media.mediaId
        }));

    }
}
