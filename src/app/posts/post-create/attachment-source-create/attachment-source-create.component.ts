import {Component, ElementRef, Input, OnInit, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import * as fromApp from "../../../store/app.reducer";
import {PostCreateService} from "../post-create.service";
import {SourceCreateService} from "../source-create.service";
import {CreateSource} from "../../../shared/model/request/create-source.model";
import {AttachmentSourceStrategyConfig} from "../../../shared/config/attchment-source-strategy.config";
import {addAttachmentSource, clearSourceData} from "../store/post-create.actions";
import {AttachmentWrapper} from "../store/post-create.reducer";

@Component({
    selector: 'app-attachment-source-create',
    templateUrl: './attachment-source-create.component.html',
    styleUrls: ['./attachment-source-create.component.css']
})
export class AttachmentSourceCreateComponent implements OnInit {

    spinnerIcon = faCircleNotch;

    @ViewChild('source', {read: ElementRef}) sourceRef!: ElementRef;
    @ViewChild('dataTemplate', {read: ViewContainerRef}) dataTemplateRef!: ViewContainerRef;

    @Input() attachment!: AttachmentWrapper;
    attachments!: AttachmentWrapper[];

    errorMessage!: string;
    isFetching!: boolean;

    data: any = null;

    sourceCreateForm!: FormGroup;

    private postCreateStoreSubscription!: Subscription;

    constructor(private store: Store<fromApp.AppState>,
                private postCreateService: PostCreateService,
                private renderer: Renderer2,
                private sourceCreateService: SourceCreateService) {
    }

    ngOnInit(): void {
        this.postCreateStoreSubscription = this.store.select('postCreate').subscribe(state => {
            this.isFetching = state.isFetching;
            this.errorMessage = state.artistErrorMessage;
            this.attachments = state.attachments;
            this.data = state.createSourceData;
        });

        this.sourceCreateForm = new FormGroup({
            strategy: new FormControl(
                this.sourceCreateService.lastAttachmentSourceStrategy,
                [Validators.required]
            )
        });

        // Clear data for strategy
        this.store.dispatch(clearSourceData());

        setTimeout(() => {
            // If strategy selected load template
            this.loadDataTemplate();
        })
    }

    ngOnDestroy(): void {
        this.postCreateStoreSubscription.unsubscribe();
    }

    onSubmit(): void {
        // If data is null or source is duplicate
        if (this.data === null ||
            this.sourceCreateService.isAttachmentSourceDuplicate(
                this.sourceCreateForm.controls.strategy.value, this.data, this.attachment
            )) {
            return;
        }

        const attachmentIndex = this.attachments.indexOf(this.attachment);

        this.store.dispatch(addAttachmentSource({
            attachmentIndex: attachmentIndex,
            source: new CreateSource(
                this.sourceCreateForm.controls.strategy.value,
                this.data
            )
        }));

        this.postCreateService.clearPostCreateSideStepModalEvent.emit();
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

        this.sourceCreateService.lastAttachmentSourceStrategy = strategy;
        this.store.dispatch(clearSourceData());

        this.dataTemplateRef!.clear();
        this.dataTemplateRef!.createComponent(AttachmentSourceStrategyConfig.getTemplateComponent(strategy));
    }
}
