import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {Subscription} from "rxjs";
import {PostCreateService} from "./post-create/post-create.service";
import {PostCreateComponent} from "./post-create/post-create.component";
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import {MediaUtils} from "../shared/util/media.utils";
import {PostsService} from "./posts.service";
import {CDN_ADDRESS} from "../shared/config/api.constants";
import {QueryPost} from "../shared/model/query/query-post.model";

@Component({
    selector: 'app-posts',
    templateUrl: './posts.component.html',
    styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('createPost', {read: ViewContainerRef}) createPostRef!: ViewContainerRef;
    @ViewChild('background', {read: ElementRef}) backgroundRef!: ElementRef;
    @ViewChild('defaultBackground', {read: ElementRef}) defaultBackgroundRef!: ElementRef;

    private selectedPost!: QueryPost | null;

    private postCreateOpenSubscription!: Subscription;
    private postCreateCloseSubscription!: Subscription;
    private storeSubscription!: Subscription;

    constructor(private store: Store<fromApp.AppState>,
                private postCreateService: PostCreateService,
                private postsService: PostsService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private renderer: Renderer2) {
    }

    ngOnInit(): void {
        this.postCreateOpenSubscription = this.postCreateService.postCreateOpenEvent.subscribe(() => {
            this.loadPostCreateForm();
        });
        this.postCreateCloseSubscription = this.postCreateService.postCreateCloseEvent.subscribe(() => {
            this.clearPostCreateForm();
        });

        const isCreatePostModeOn = this.activatedRoute.snapshot.queryParams.create;
        if (isCreatePostModeOn == 'true') {
            // Set timeout to let @ViewChild initialize
            setTimeout(() => this.postCreateService.postCreateOpenEvent.emit());
        }

        this.postsService.triggerSearch();
    }

    ngAfterViewInit(): void {
        this.storeSubscription = this.store.select('posts').subscribe(state => {
            // If selected post changed
            if (this.selectedPost !== state.selectedPost) {
                this.selectedPost = state.selectedPost;

                this.loadBackground();
            }
        });
    }

    ngOnDestroy(): void {
        this.storeSubscription.unsubscribe();
        this.postCreateOpenSubscription.unsubscribe();
        this.postCreateCloseSubscription.unsubscribe();
    }

    private loadPostCreateForm(): void {
        this.router.navigate([], {
            queryParams: {
                create: true
            },
            queryParamsHandling: "merge"
        });

        this.createPostRef!.clear();
        this.createPostRef!.createComponent(PostCreateComponent);
    }

    private clearPostCreateForm(): void {
        this.router.navigate([], {
            queryParams: {
                create: false
            },
            queryParamsHandling: "merge"
        });

        this.createPostRef.clear();
    }

    private loadBackground(): void {
        if (!!this.selectedPost) {
            const media = MediaUtils.getHighestPriorityMedia(this.selectedPost.mediaSet);
            if (!media) {
                return;
            }

            this.renderer.setStyle(this.defaultBackgroundRef.nativeElement, "display", "none")

            this.renderer.setStyle(this.backgroundRef.nativeElement, "background-image", "url(" + CDN_ADDRESS + media.thumbnailUri + ")")
            this.renderer.setStyle(this.backgroundRef.nativeElement, "opacity", "1")
        } else {
            this.renderer.setStyle(this.defaultBackgroundRef.nativeElement, "display", "block")

            this.renderer.setStyle(this.backgroundRef.nativeElement, "opacity", "0")
        }
    }

}
