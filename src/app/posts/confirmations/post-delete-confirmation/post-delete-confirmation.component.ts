import {Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {PostCreateService} from "../../post-create/post-create.service";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import * as fromApp from "../../../store/app.reducer";
import {deletePostStart} from "../../store/posts.actions";
import {KeycloakProfile} from "keycloak-js";
import {QueryPost} from "../../../shared/model/query/query-post.model";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons/faCircleNotch";

@Component({
    selector: 'app-post-delete-confirmation',
    templateUrl: './post-delete-confirmation.component.html',
    styleUrls: ['./post-delete-confirmation.component.css']
})
export class PostDeleteConfirmationComponent implements OnInit, OnDestroy {

    @ViewChild('backdrop', {read: ElementRef}) backdropRef!: ElementRef;
    @ViewChild('section', {read: ElementRef}) sectionRef!: ElementRef;

    spinnerIcon = faCircleNotch;

    @Input()
    post!: QueryPost;

    isFetching!: boolean;
    errorMessage!: string;

    private authenticationStoreSubscription!: Subscription;
    private storeSubscription!: Subscription;

    private currentUser!: KeycloakProfile | null;

    constructor(private store: Store<fromApp.AppState>,
                private renderer: Renderer2,
                private postCreateService: PostCreateService) {
    }

    ngOnInit(): void {
        this.authenticationStoreSubscription = this.store.select('authentication').subscribe(state => {
            this.currentUser = state.currentUser;
        });

        this.storeSubscription = this.store.select('postCreate').subscribe(state => {
            this.isFetching = state.isFetching;
            this.errorMessage = state.postDeleteErrorMessage;
        });
    }

    ngOnDestroy(): void {
        this.authenticationStoreSubscription.unsubscribe();
    }

    onClose(): void {
        this.renderer.addClass(this.backdropRef.nativeElement, "animate__fadeOut");
        this.renderer.addClass(this.sectionRef.nativeElement, "animate__fadeOut");

        // Let the animations finish
        setTimeout(() => {
            this.postCreateService.clearPostCreateModalEvent.emit();
        }, 100);
    }

    onPostDelete(): void {
        this.store.dispatch(deletePostStart({
            userId: this.currentUser?.id!,
            postId: this.post.postId
        }));

        this.onClose();
    }
}
