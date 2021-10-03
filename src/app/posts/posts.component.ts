import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Subscription} from "rxjs";
import {PostCreateService} from "./post-create/post-create.service";
import {PostCreateComponent} from "./post-create/post-create.component";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-posts',
    templateUrl: './posts.component.html',
    styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit, OnDestroy {

    @ViewChild('createPost', {read: ViewContainerRef}) createPostRef!: ViewContainerRef;

    private postCreateOpenSubscription!: Subscription;
    private postCreateCloseSubscription!: Subscription;

    constructor(private postCreateService: PostCreateService,
                private componentFactoryResolver: ComponentFactoryResolver,
                private router: Router,
                private activatedRoute: ActivatedRoute) {
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
    }


    ngOnDestroy(): void {
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

        const postCreateComponent = this.componentFactoryResolver.resolveComponentFactory(PostCreateComponent);

        this.createPostRef!.clear();
        this.createPostRef!.createComponent(postCreateComponent);
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

}
