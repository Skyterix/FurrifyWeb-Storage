import {Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
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

@Component({
    selector: 'app-post-details',
    templateUrl: './post-details.component.html',
    styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {

    @Input() post!: QueryPost;

    @ViewChild('mediaView', {read: ElementRef}) mediaViewRef!: ElementRef;
    @ViewChild('mediaSpinner', {read: ElementRef}) mediaSpinnerRef!: ElementRef;

    circleNotchIcon = faCircleNotch;

    index!: number;

    sortedTags!: Tag[];
    sortedMedia!: Media[];

    galleryItems: { src: string, w: number, h: number }[] = [];

    constructor(private renderer: Renderer2,
                private postsService: PostsService,
                private store: Store<fromApp.AppState>,
                private activatedRoute: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        // Sort
        this.sortedTags = TagUtils.sortTagsByPriority([...this.post.tags]);
        this.sortedMedia = MediaUtils.sortByPriority([...this.post.mediaSet]);
        this.sortedMedia.forEach(media => {
            this.galleryItems.push({
                src: CDN_ADDRESS + media.fileUri,
                w: 0,
                h: 0
            });
        });

        // On index change
        this.activatedRoute.params.subscribe(params => {
            // Get selected media index from url
            this.index = params.index;

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

    onMediaLoaded(): void {
        this.renderer.removeStyle(this.mediaViewRef.nativeElement, 'display');
        this.renderer.removeStyle(this.mediaSpinnerRef.nativeElement, 'display');
    }


    searchPosts(): void {
        // Let router navigate first so search can be updated
        setTimeout(() => {
            this.postsService.triggerSearch();
        });
    }

    openImageGallery(): void {
        const pswpElement: HTMLElement = document.querySelector('.pswp')!;

        const options = {
            history: false,
            index: 0,
            clickToCloseNonZoomable: false
        };

        const gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, this.galleryItems, options);
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
        this.renderer.setStyle(this.mediaViewRef.nativeElement, 'display', 'none');
        this.renderer.setStyle(this.mediaSpinnerRef.nativeElement, 'display', 'inline-block');

        this.renderer.setAttribute(this.mediaViewRef.nativeElement, 'src', CDN_ADDRESS + media.fileUri);
    }
}
