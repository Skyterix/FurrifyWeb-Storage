import {
    Component,
    ComponentFactory,
    ComponentFactoryResolver,
    OnInit,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {PostCreateService} from "./post-create.service";
import {PostCreateInfoStepComponent} from "./post-create-info-step/post-create-info-step.component";
import {PostCreateContentStepComponent} from "./post-create-content-step/post-create-content-step.component";
import {PostCreateUploadStepComponent} from "./post-create-upload-step/post-create-upload-step.component";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

    @ViewChild('currentStep', {read: ViewContainerRef}) currentStepRef!: ViewContainerRef;

    isFetching = false;
    errorMessage: string | null = null;

    constructor(private postCreateService: PostCreateService, private componentFactoryResolver: ComponentFactoryResolver) {
    }

    ngOnInit(): void {
        this.postCreateService.postInfoStepOpenEvent.subscribe(() => {
            const postInfoStepComponent = this.componentFactoryResolver.resolveComponentFactory(PostCreateInfoStepComponent);

            this.loadStep<PostCreateInfoStepComponent>(postInfoStepComponent);
        });

        this.postCreateService.postContentStepOpenEvent.subscribe(() => {
            const postContentStepComponent = this.componentFactoryResolver.resolveComponentFactory(PostCreateContentStepComponent);

            this.loadStep<PostCreateContentStepComponent>(postContentStepComponent);
        });

        this.postCreateService.postUploadStepOpenEvent.subscribe(() => {
            const postUploadStepComponent = this.componentFactoryResolver.resolveComponentFactory(PostCreateUploadStepComponent);

            this.loadStep<PostCreateUploadStepComponent>(postUploadStepComponent);
        });


        // Load default step
        setTimeout(() => this.postCreateService.postInfoStepOpenEvent.emit());
    }

    onClose(): void {
        this.postCreateService.postCreateCloseEvent.emit();
    }

    private loadStep<T>(component: ComponentFactory<T>) {
        this.currentStepRef!.clear();
        this.currentStepRef!.createComponent(component);
    }
}
