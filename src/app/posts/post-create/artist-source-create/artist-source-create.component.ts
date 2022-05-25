import {Component, ElementRef, Input, OnInit, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons";
import {ArtistWrapper} from "../store/post-create.reducer";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import * as fromApp from "../../../store/app.reducer";
import {PostCreateService} from "../post-create.service";
import {SourceCreateService} from "../source-create.service";
import {clearSourceData, createArtistSourceStart} from "../store/post-create.actions";
import {CreateSource} from "../../../shared/model/request/create-source.model";
import {ArtistSourceStrategyConfig} from "../../../shared/config/artist-source-strategy.config";
import {KeycloakProfile} from "keycloak-js";

@Component({
    selector: 'app-artist-source-create',
    templateUrl: './artist-source-create.component.html',
    styleUrls: ['./artist-source-create.component.css']
})
export class ArtistSourceCreateComponent implements OnInit {
    spinnerIcon = faCircleNotch;

    @ViewChild('source', {read: ElementRef}) sourceRef!: ElementRef;
    @ViewChild('dataTemplate', {read: ViewContainerRef}) dataTemplateRef!: ViewContainerRef;

    @Input() artist!: ArtistWrapper;

    errorMessage!: string | null;
    isFetching!: boolean;

    data: any = null;

    sourceCreateForm!: FormGroup;

    private postCreateStoreSubscription!: Subscription;
    private authenticationStoreSubscription!: Subscription;
    private currentUser!: KeycloakProfile | null;

    constructor(private store: Store<fromApp.AppState>,
                private postCreateService: PostCreateService,
                private renderer: Renderer2,
                private sourceCreateService: SourceCreateService) {
    }

    ngOnInit(): void {
        this.postCreateStoreSubscription = this.store.select('postCreate').subscribe(state => {
            this.isFetching = state.isFetching;
            this.errorMessage = state.artistSourceCreateErrorMessage;
            this.data = state.createSourceData;
        });
        this.authenticationStoreSubscription = this.store.select('authentication').subscribe(state => {
            this.currentUser = state.currentUser;
        });

        this.sourceCreateForm = new FormGroup({
            strategy: new FormControl(
                this.sourceCreateService.lastArtistSourceStrategy,
                [Validators.required]
            )
        });

        // Clear data for strategy
        this.store.dispatch(clearSourceData());

        setTimeout(() => {
            // If strategy selected load template
            this.loadDataTemplate();
        });
    }

    ngOnDestroy(): void {
        this.postCreateStoreSubscription.unsubscribe();
        this.authenticationStoreSubscription.unsubscribe();
    }

    onSubmit(): void {
        // If data is null or source is duplicate
        if (this.data === null ||
            this.sourceCreateService.isArtistSourceDuplicate(
                this.sourceCreateForm.controls.strategy.value, this.data, this.artist
            )) {
            return;
        }

        this.store.dispatch(createArtistSourceStart({
            userId: this.currentUser?.id!,
            artistId: this.artist.artist.artistId,
            createSource: new CreateSource(
                this.sourceCreateForm.controls.strategy.value,
                this.data
            )
        }));
    }

    onClose(): void {
        this.renderer.addClass(this.sourceRef.nativeElement, "animate__fadeOut");

        // Let the animation finish
        setTimeout(() => {
            this.postCreateService.clearPostCreateSideStepModalEvent.emit();
        }, 100);
    }

    loadDataTemplate(): void {
        const strategy = this.sourceCreateForm.controls.strategy.value;

        if (!strategy) {
            return;
        }

        this.sourceCreateService.lastArtistSourceStrategy = strategy;
        this.store.dispatch(clearSourceData());

        this.dataTemplateRef!.clear();
        this.dataTemplateRef!.createComponent(ArtistSourceStrategyConfig.getTemplateComponent(strategy));
    }

}
