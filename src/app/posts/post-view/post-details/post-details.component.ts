import {Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Tag} from "../../../shared/model/tag.model";
import {Post} from "../../../shared/model/post.model";
import {TagUtils} from "../../../shared/util/tag.utils";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons/faCircleNotch";
import {Media} from "../../../shared/model/media.model";
import {MediaUtils} from "../../../shared/util/media.utils";
import {Store} from "@ngrx/store";
import * as fromApp from "../../../store/app.reducer";
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

    index!: number;

    sortedTags!: Tag[];
    sortedMedia!: Media[];

    constructor(private renderer: Renderer2,
                private store: Store<fromApp.AppState>,
                private activatedRoute: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        // Sort
        this.sortedTags = TagUtils.sortTagsByPriority([...this.post.tags]);
        this.sortedMedia = MediaUtils.sortByPriority([...this.post.mediaSet]);

        // On index change
        this.activatedRoute.params.subscribe(params => {
            // Get selected media index from url
            this.index = params.index;

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

    private loadMedia(media: Media): void {
        this.renderer.setStyle(this.mediaViewRef.nativeElement, 'display', 'none');
        this.renderer.setStyle(this.mediaSpinnerRef.nativeElement, 'display', 'inline-block');

        this.renderer.setAttribute(this.mediaViewRef.nativeElement, 'src', media.fileUrl);
    }
}
