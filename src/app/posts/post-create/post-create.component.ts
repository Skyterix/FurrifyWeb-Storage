import {
    Component,
    ComponentRef,
    ElementRef,
    OnDestroy,
    OnInit,
    Renderer2,
    Type,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {PostCreateService} from "./post-create.service";
import {PostCreateInfoStepComponent} from "./post-create-info-step/post-create-info-step.component";
import {PostCreateContentStepComponent} from "./post-create-content-step/post-create-content-step.component";
import {PostCreateUploadStepComponent} from "./post-create-upload-step/post-create-upload-step.component";
import {Subscription} from "rxjs";
import {TagCreateComponent} from "./post-create-info-step/tag-create/tag-create.component";
import {ArtistCreateComponent} from "./post-create-info-step/artist-create/artist-create.component";
import {MediaCreateComponent} from "./post-create-content-step/media-create/media-create.component";
import {AttachmentCreateComponent} from "./post-create-content-step/attachment-create/attachment-create.component";
import {Store} from "@ngrx/store";
import * as fromApp from "../../store/app.reducer";
import {MediaSourceCreateComponent} from "./post-create-content-step/media-source-create/media-source-create.component";
import {
    AttachmentSourceCreateComponent
} from "./post-create-content-step/attachment-source-create/attachment-source-create.component";
import {ArtistSourceCreateComponent} from "./post-create-info-step/artist-source-create/artist-source-create.component";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {

    @ViewChild('currentStep', {read: ViewContainerRef}) currentStepRef!: ViewContainerRef;
    @ViewChild('currentSideStep', {read: ViewContainerRef}) currentSideStepRef!: ViewContainerRef;

    @ViewChild('backdrop', {read: ElementRef}) backdropRef!: ElementRef;
    @ViewChild('section', {read: ElementRef}) sectionRef!: ElementRef;

    isErrorPostCreationRelated = false;
    errorMessage: string | null = null;
    isFetching!: boolean;

    private postInfoStepOpenEventSubscription!: Subscription;
    private postContentStepOpenEventSubscription!: Subscription;
    private postUploadStepOpenEventSubscription!: Subscription;

    private tagCreateOpenEventSubscription!: Subscription;
    private clearPostCreateSideStepModalSubscription!: Subscription;

    private artistCreateOpenEventSubscription!: Subscription;

    private mediaSourceCreateOpenEventSubscription!: Subscription;
    private artistSourceCreateOpenEventSubscription!: Subscription;
    private attachmentSourceCreateOpenEventSubscription!: Subscription;

    private mediaCreateOpenEventSubscription!: Subscription;

    private attachmentCreateOpenEventSubscription!: Subscription;

    private storeSubscription!: Subscription;

    constructor(private postCreateService: PostCreateService,
                private renderer: Renderer2,
                private store: Store<fromApp.AppState>) {
    }

    ngOnInit(): void {
        this.postInfoStepOpenEventSubscription = this.postCreateService.postInfoStepOpenEvent.subscribe(() => {

            this.loadStep<PostCreateInfoStepComponent>(PostCreateInfoStepComponent);
        });
        this.postContentStepOpenEventSubscription = this.postCreateService.postContentStepOpenEvent.subscribe(() => {
            this.loadStep<PostCreateContentStepComponent>(PostCreateContentStepComponent);
        });

        this.postUploadStepOpenEventSubscription = this.postCreateService.postUploadStepOpenEvent.subscribe(() => {

            this.loadStep<PostCreateUploadStepComponent>(PostCreateUploadStepComponent);
        });

        this.tagCreateOpenEventSubscription = this.postCreateService.tagCreateOpenEvent.subscribe(tagValue => {
            this.loadSideStep<TagCreateComponent>(TagCreateComponent, componentRef => {
                componentRef.instance.value = tagValue;
            });
        });

        this.artistCreateOpenEventSubscription = this.postCreateService.artistCreateOpenEvent.subscribe(artistPreferredNickname => {
            this.loadSideStep<ArtistCreateComponent>(ArtistCreateComponent, componentRef => {
                componentRef.instance.preferredNickname = artistPreferredNickname;
            });
        });

        this.mediaSourceCreateOpenEventSubscription = this.postCreateService.mediaSourceCreateOpenEvent.subscribe(media => {
            this.loadSideStep<MediaSourceCreateComponent>(MediaSourceCreateComponent, componentRef => {
                componentRef.instance.media = media;
            });
        });

        this.attachmentSourceCreateOpenEventSubscription = this.postCreateService.attachmentSourceCreateOpenEvent.subscribe(attachment => {
            this.loadSideStep<AttachmentSourceCreateComponent>(AttachmentSourceCreateComponent, componentRef => {
                componentRef.instance.attachment = attachment;
            });
        });

        this.artistSourceCreateOpenEventSubscription = this.postCreateService.artistSourceCreateOpenEvent.subscribe(artist => {
            this.loadSideStep<ArtistSourceCreateComponent>(ArtistSourceCreateComponent, componentRef => {
                componentRef.instance.artist = artist;
            });
        });

        this.mediaCreateOpenEventSubscription = this.postCreateService.mediaCreateOpenEvent.subscribe(() => {
            this.loadSideStep<MediaCreateComponent>(MediaCreateComponent);
        });
        this.clearPostCreateSideStepModalSubscription = this.postCreateService.clearPostCreateSideStepModalEvent.subscribe(() => {
            setTimeout(() => this.clearSideView());
        });

        this.attachmentCreateOpenEventSubscription = this.postCreateService.attachmentCreateOpenEvent.subscribe(() => {
            this.loadSideStep<AttachmentCreateComponent>(AttachmentCreateComponent);
        });

        this.storeSubscription = this.store.select('postCreate').subscribe(state => {
            this.errorMessage = state.postCreateErrorMessage;
            this.isErrorPostCreationRelated = state.isErrorPostCreationRelated;
            this.isFetching = state.currentlyFetchingCount > 0;
        });

        // Load default step
        setTimeout(() => this.postCreateService.postInfoStepOpenEvent.emit());
    }

    ngOnDestroy(): void {
        this.postInfoStepOpenEventSubscription.unsubscribe();
        this.postContentStepOpenEventSubscription.unsubscribe();
        this.postUploadStepOpenEventSubscription.unsubscribe();
        this.artistCreateOpenEventSubscription.unsubscribe();
        this.mediaCreateOpenEventSubscription.unsubscribe();
        this.artistCreateOpenEventSubscription.unsubscribe();
        this.mediaSourceCreateOpenEventSubscription.unsubscribe();
        this.attachmentSourceCreateOpenEventSubscription.unsubscribe();

        this.clearPostCreateSideStepModalSubscription.unsubscribe();

        this.storeSubscription.unsubscribe();
    }

    onClose(): void {
        this.renderer.addClass(this.backdropRef.nativeElement, "animate__fadeOut");
        this.renderer.addClass(this.sectionRef.nativeElement, "animate__fadeOut");

        // Let the animations finish
        setTimeout(() => {
            this.postCreateService.clearPostCreateModalEvent.emit();
        }, 100);
    }

    private loadStep<T>(component: Type<T>): void {
        this.currentStepRef!.clear();
        this.currentStepRef!.createComponent(component);
    }

    private loadSideStep<T>(component: Type<T>, executeOnComponent?: (componentRef: ComponentRef<T>) => void): void {
        // Check if something is currently fetching, if so prevent opening of side panel
        if (this.isFetching) {
            return;
        }

        this.currentSideStepRef!.clear();
        const componentRef = this.currentSideStepRef!.createComponent(component);

        // If additional execute command is passed
        if (!!executeOnComponent) {
            executeOnComponent(componentRef);
        }
    }

    private clearSideView(): void {
        if (!this.currentSideStepRef) {
            return;
        }

        this.currentSideStepRef.clear();
    }

    onRetry(): void {
        this.postCreateService.retryPostCreate();
    }
}
