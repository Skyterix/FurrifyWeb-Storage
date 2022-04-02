import {Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {PostCreateService} from "../../../../posts/post-create/post-create.service";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import * as fromApp from "../../../../store/app.reducer";
import {KeycloakProfile} from "keycloak-js";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons/faCircleNotch";
import {ConfirmationsService} from "../confirmations.service";

@Component({
    selector: 'app-post-delete-confirmation',
    templateUrl: './delete-confirmation.component.html',
    styleUrls: ['./delete-confirmation.component.css']
})
export class DeleteConfirmationComponent implements OnInit, OnDestroy {

    @ViewChild('backdrop', {read: ElementRef}) backdropRef!: ElementRef;
    @ViewChild('section', {read: ElementRef}) sectionRef!: ElementRef;

    spinnerIcon = faCircleNotch;

    @Input()
    onDeleteCallback!: (onDelete: void) => void;

    isFetching!: boolean;
    errorMessage!: string;

    private authenticationStoreSubscription!: Subscription;
    private artistsStoreSubscription!: Subscription;
    private postsStoreSubscription!: Subscription;

    private currentUser!: KeycloakProfile | null;

    constructor(private store: Store<fromApp.AppState>,
                private renderer: Renderer2,
                private postCreateService: PostCreateService,
                private confirmationsService: ConfirmationsService) {
    }

    ngOnInit(): void {
        this.authenticationStoreSubscription = this.store.select('authentication').subscribe(state => {
            this.currentUser = state.currentUser;
        });

        this.postsStoreSubscription = this.store.select('posts').subscribe(state => {
            this.isFetching = state.isFetching;
            this.errorMessage = state.postDeleteErrorMessage;
        });

        this.artistsStoreSubscription = this.store.select('artists').subscribe(state => {
            this.isFetching = state.isFetching;
            this.errorMessage = state.artistDeleteErrorMessage;
        });
    }

    ngOnDestroy(): void {
        this.authenticationStoreSubscription.unsubscribe();
        this.postsStoreSubscription.unsubscribe();
        this.artistsStoreSubscription.unsubscribe();
    }

    onClose(): void {
        this.renderer.addClass(this.backdropRef.nativeElement, "animate__fadeOut");
        this.renderer.addClass(this.sectionRef.nativeElement, "animate__fadeOut");

        // Let the animations finish
        setTimeout(() => {
            this.confirmationsService.clearConfirmationModalEvent.emit();
        }, 100);
    }

    onDelete(): void {
        this.onDeleteCallback();

        this.onClose();
    }
}
