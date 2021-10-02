import {Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Tag} from "../../../shared/model/tag.model";
import {Post} from "../../../shared/model/post.model";
import {TagUtils} from "../../../shared/util/tag.utils";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons/faCircleNotch";
import {Media} from "../../../shared/model/media.model";
import {MediaUtils} from "../../../shared/util/media.utils";
import {Store} from "@ngrx/store";
import * as fromApp from "../../../store/app.reducer";
import {selectMedia} from "../../store/posts.actions";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-post-details',
    templateUrl: './post-details.component.html',
    styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {

    @Input() post!: Post;

    @ViewChild('mediaView', {read: ElementRef}) mediaViewRef!: ElementRef;
    @ViewChild('mediaSpinner', {read: ElementRef}) mediaSpinnerRef!: ElementRef;

    circleNotchIcon = faCircleNotch;

    sortedTags!: Tag[];
    sortedMedia!: Media[];

    selectedMedia!: Media | null;

    constructor(private renderer: Renderer2,
                private store: Store<fromApp.AppState>,
                private activatedRoute: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        this.store.select('posts').subscribe(state => {
            this.selectedMedia = state.selectedMedia;

            // If selected media is not null
            if (!!this.selectedMedia) {
                // Load media after view init
                setTimeout(() => this.loadMedia(this.selectedMedia!));
            }
        });

        this.sortedTags = TagUtils.sortTagsByPriority([...this.post.tags]);
        this.sortedMedia = MediaUtils.sortByPriority([...this.post.mediaSet]);

        // Get selected media index from url or default
        const mediaIndex =
            (!this.activatedRoute.snapshot.queryParams.index ||
                this.activatedRoute.snapshot.queryParams.index < 0) ?
                0 : this.activatedRoute.snapshot.queryParams.index;

        console.log(mediaIndex);

        // If media exists in post
        if (this.sortedMedia[mediaIndex] !== null) {
            this.store.dispatch(selectMedia({
                media: this.sortedMedia[mediaIndex]
            }));
        }
    }

    onMediaLoaded(): void {
        this.renderer.removeStyle(this.mediaViewRef.nativeElement, 'display');
        this.renderer.removeStyle(this.mediaSpinnerRef.nativeElement, 'display');
    }

    // TODO Media index should be loaded from url
    private loadMedia(media: Media): void {
        this.router.navigate([], {
            queryParams: {
                index: this.sortedMedia.indexOf(media)
            },
            queryParamsHandling: "merge"
        });

        this.renderer.setStyle(this.mediaViewRef.nativeElement, 'display', 'none');
        this.renderer.setStyle(this.mediaSpinnerRef.nativeElement, 'display', 'inline-block');

        this.renderer.setAttribute(this.mediaViewRef.nativeElement, 'src', media.fileUrl);
    }
}
