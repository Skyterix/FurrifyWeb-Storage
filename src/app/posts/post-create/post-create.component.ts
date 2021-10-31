import {
    Component,
    ComponentFactory,
    ComponentFactoryResolver,
    ComponentRef,
    OnDestroy,
    OnInit,
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

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {

    @ViewChild('currentStep', {read: ViewContainerRef}) currentStepRef!: ViewContainerRef;
    @ViewChild('currentSideStep', {read: ViewContainerRef}) currentSideStepRef!: ViewContainerRef;

    isFetching = false;
    errorMessage: string | null = null;

    private postInfoStepOpenEventSubscription!: Subscription;
    private postContentStepOpenEventSubscription!: Subscription;
    private postUploadStepOpenEventSubscription!: Subscription;
    private tagCreateOpenEventSubscription!: Subscription;
    private tagCreateCloseEventSubscription!: Subscription;
    private artistCreateOpenEventSubscription!: Subscription;
    private artistCreateCloseEventSubscription!: Subscription;

    constructor(private postCreateService: PostCreateService, private componentFactoryResolver: ComponentFactoryResolver) {
    }

    ngOnInit(): void {
        this.postInfoStepOpenEventSubscription = this.postCreateService.postInfoStepOpenEvent.subscribe(() => {
            const postInfoStepComponent = this.componentFactoryResolver.resolveComponentFactory(PostCreateInfoStepComponent);

            this.loadStep<PostCreateInfoStepComponent>(postInfoStepComponent);
        });
        this.postContentStepOpenEventSubscription = this.postCreateService.postContentStepOpenEvent.subscribe(() => {
            const postContentStepComponent = this.componentFactoryResolver.resolveComponentFactory(PostCreateContentStepComponent);

            this.loadStep<PostCreateContentStepComponent>(postContentStepComponent);
        });

        this.postUploadStepOpenEventSubscription = this.postCreateService.postUploadStepOpenEvent.subscribe(() => {
            const postUploadStepComponent = this.componentFactoryResolver.resolveComponentFactory(PostCreateUploadStepComponent);

            this.loadStep<PostCreateUploadStepComponent>(postUploadStepComponent);
        });

        this.tagCreateOpenEventSubscription = this.postCreateService.tagCreateOpenEvent.subscribe(tagValue => {
            const createTagComponent = this.componentFactoryResolver.resolveComponentFactory(TagCreateComponent);

            const componentRef = this.loadSideStep<TagCreateComponent>(createTagComponent);
            componentRef.instance.value = tagValue;
        });
        this.tagCreateCloseEventSubscription = this.postCreateService.tagCreateCloseEvent.subscribe(__ => {
            setTimeout(() => this.clearSideView());
        });

        this.artistCreateOpenEventSubscription = this.postCreateService.artistCreateOpenEvent.subscribe(artistPreferredNickname => {
            const createArtistComponent = this.componentFactoryResolver.resolveComponentFactory(ArtistCreateComponent);

            const componentRef = this.loadSideStep<ArtistCreateComponent>(createArtistComponent);
            componentRef.instance.preferredNickname = artistPreferredNickname;
        });
        this.artistCreateCloseEventSubscription = this.postCreateService.artistCreateCloseEvent.subscribe(__ => {
            setTimeout(() => this.clearSideView());
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
    }

    onClose(): void {
        this.postCreateService.postCreateCloseEvent.emit();
    }

    private loadStep<T>(component: ComponentFactory<T>): void {
        this.currentStepRef!.clear();
        this.currentStepRef!.createComponent(component);
    }

    private loadSideStep<T>(component: ComponentFactory<T>): ComponentRef<T> {
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
