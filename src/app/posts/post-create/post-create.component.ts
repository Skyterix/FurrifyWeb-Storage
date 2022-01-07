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
import {TagCreateComponent} from "./tag-create/tag-create.component";
import {ArtistCreateComponent} from "./artist-create/artist-create.component";
import {MediaCreateComponent} from "./media-create/media-create.component";
import {AttachmentCreateComponent} from "./attachment-create/attachment-create.component";
import {Store} from "@ngrx/store";
import * as fromApp from "../../store/app.reducer";
import {MediaSourceCreateComponent} from "./media-source-create/media-source-create.component";
import {AttachmentSourceCreateComponent} from "./attachment-source-create/attachment-source-create.component";

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

    isFetching = false;
    errorMessage: string | null = null;

    private postInfoStepOpenEventSubscription!: Subscription;
    private postContentStepOpenEventSubscription!: Subscription;
    private postUploadStepOpenEventSubscription!: Subscription;

    private tagCreateOpenEventSubscription!: Subscription;
    private tagCreateCloseEventSubscription!: Subscription;

    private artistCreateOpenEventSubscription!: Subscription;
    private artistCreateCloseEventSubscription!: Subscription;

    private mediaSourceCreateOpenEventSubscription!: Subscription;
    private mediaSourceCreateCloseEventSubscription!: Subscription;

    private attachmentSourceCreateOpenEventSubscription!: Subscription;
    private attachmentSourceCreateCloseEventSubscription!: Subscription;

    private mediaCreateOpenEventSubscription!: Subscription;
    private mediaCreateCloseEventSubscription!: Subscription;

    private attachmentCreateOpenEventSubscription!: Subscription;
    private attachmentCreateCloseEventSubscription!: Subscription;

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
            const componentRef = this.loadSideStep<TagCreateComponent>(TagCreateComponent);
            componentRef.instance.value = tagValue;
        });
        this.tagCreateCloseEventSubscription = this.postCreateService.tagCreateCloseEvent.subscribe(() => {
            setTimeout(() => this.clearSideView());
        });

        this.artistCreateOpenEventSubscription = this.postCreateService.artistCreateOpenEvent.subscribe(artistPreferredNickname => {
            const componentRef = this.loadSideStep<ArtistCreateComponent>(ArtistCreateComponent);
            componentRef.instance.preferredNickname = artistPreferredNickname;
        });
        this.artistCreateCloseEventSubscription = this.postCreateService.artistCreateCloseEvent.subscribe(() => {
            setTimeout(() => this.clearSideView());
        });

        this.mediaSourceCreateOpenEventSubscription = this.postCreateService.mediaSourceCreateOpenEvent.subscribe(media => {
            const componentRef = this.loadSideStep<MediaSourceCreateComponent>(MediaSourceCreateComponent);
            componentRef.instance.media = media;
        });
        this.mediaSourceCreateCloseEventSubscription = this.postCreateService.mediaSourceCreateCloseEvent.subscribe(() => {
            setTimeout(() => this.clearSideView());
        });

        this.attachmentSourceCreateOpenEventSubscription = this.postCreateService.attachmentSourceCreateOpenEvent.subscribe(attachment => {
            const componentRef = this.loadSideStep<AttachmentSourceCreateComponent>(AttachmentSourceCreateComponent);
            componentRef.instance.attachment = attachment;
        });
        this.attachmentSourceCreateCloseEventSubscription = this.postCreateService.attachmentSourceCreateCloseEvent.subscribe(() => {
            setTimeout(() => this.clearSideView());
        });

        this.mediaCreateOpenEventSubscription = this.postCreateService.mediaCreateOpenEvent.subscribe(() => {
            this.loadSideStep<MediaCreateComponent>(MediaCreateComponent);
        });
        this.mediaCreateCloseEventSubscription = this.postCreateService.mediaCreateCloseEvent.subscribe(() => {
            setTimeout(() => this.clearSideView());
        });

        this.attachmentCreateOpenEventSubscription = this.postCreateService.attachmentCreateOpenEvent.subscribe(() => {
            this.loadSideStep<AttachmentCreateComponent>(AttachmentCreateComponent);
        });
        this.attachmentCreateCloseEventSubscription = this.postCreateService.attachmentCreateCloseEvent.subscribe(() => {
            setTimeout(() => this.clearSideView());
        });

        this.storeSubscription = this.store.select('posts').subscribe(state => {
            this.errorMessage = state.postCreateErrorMessage;
        });

        // Load default step
        setTimeout(() => this.postCreateService.postInfoStepOpenEvent.emit());
    }

    ngOnDestroy(): void {
        this.postInfoStepOpenEventSubscription.unsubscribe();
        this.postContentStepOpenEventSubscription.unsubscribe();
        this.postUploadStepOpenEventSubscription.unsubscribe();
        this.tagCreateCloseEventSubscription.unsubscribe();
        this.tagCreateCloseEventSubscription.unsubscribe();
        this.artistCreateOpenEventSubscription.unsubscribe();
        this.artistCreateCloseEventSubscription.unsubscribe();
        this.mediaCreateOpenEventSubscription.unsubscribe();
        this.mediaCreateCloseEventSubscription.unsubscribe();
        this.artistCreateOpenEventSubscription.unsubscribe();
        this.artistCreateCloseEventSubscription.unsubscribe();
        this.mediaSourceCreateOpenEventSubscription.unsubscribe();
        this.mediaSourceCreateCloseEventSubscription.unsubscribe();
        this.attachmentSourceCreateOpenEventSubscription.unsubscribe();
        this.attachmentSourceCreateCloseEventSubscription.unsubscribe();
        this.storeSubscription.unsubscribe();
    }

    onClose(): void {
        this.renderer.addClass(this.backdropRef.nativeElement, "animate__fadeOut");
        this.renderer.addClass(this.sectionRef.nativeElement, "animate__fadeOut");

        // Let the animations finish
        setTimeout(() => {
            this.postCreateService.postCreateCloseEvent.emit();
        }, 100);
    }

    private loadStep<T>(component: Type<T>): void {
        this.currentStepRef!.clear();
        this.currentStepRef!.createComponent(component);
    }

    private loadSideStep<T>(component: Type<T>): ComponentRef<T> {
        this.currentSideStepRef!.clear();
        return this.currentSideStepRef!.createComponent(component);
    }

    private clearSideView(): void {
        if (!this.currentSideStepRef) {
            return;
        }

        this.currentSideStepRef.clear();
    }
}
