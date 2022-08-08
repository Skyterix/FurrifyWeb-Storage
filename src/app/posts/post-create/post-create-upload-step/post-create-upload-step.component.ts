import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import * as fromApp from "../../../store/app.reducer";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons/faCircleNotch";
import {KeycloakProfile} from "keycloak-js";
import {PostCreateService} from "../post-create.service";
import {PostCreateStatusEnum} from "../../../shared/enum/post-create-status.enum";
import {ActivatedRoute} from "@angular/router";
import {PostSaveStatusEnum} from "../../../shared/enum/post-save-status.enum";

@Component({
    selector: 'app-post-create-upload-step',
    templateUrl: './post-create-upload-step.component.html',
    styleUrls: ['./post-create-upload-step.component.css']
})
export class PostCreateUploadStepComponent implements OnInit, OnDestroy {

    spinnerIcon = faCircleNotch;

    errorMessage!: string;
    isFetching!: boolean;
    isFormValid = false;

    currentUser!: KeycloakProfile | null;

    private postsStoreSubscription!: Subscription;
    private postCreateStatusChangeSubscription!: Subscription;
    private postSaveStatusChangeSubscription!: Subscription;
    private editMode = false;

    constructor(private store: Store<fromApp.AppState>,
                private postCreateService: PostCreateService,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.postsStoreSubscription = this.store.select('postCreate').subscribe(state => {
            this.isFetching = state.currentlyFetchingCount > 0;

            this.isFormValid = this.postCreateService.isFormDataValid();
        });

        this.postCreateStatusChangeSubscription = this.postCreateService.postCreateStatusChangeEvent.subscribe(
            status => this.handlePostCreateStatusChange(status)
        );
        this.postSaveStatusChangeSubscription = this.postCreateService.postSaveStatusChangeEvent.subscribe(
            status => this.handlePostSaveStatusChange(status)
        );

        this.activatedRoute.queryParams.subscribe(queryParams => {
            this.editMode = queryParams.edit === 'true';
        });
    }

    ngOnDestroy(): void {
        this.postsStoreSubscription.unsubscribe();
        this.postCreateStatusChangeSubscription.unsubscribe();
    }

    onSubmit(): void {
        if (this.isFetching) {
            return;
        }

        if (this.editMode) {
            this.postCreateService.triggerPostSave();
        } else {
            this.postCreateService.triggerPostCreate();
        }

    }

    private handlePostSaveStatusChange(status: PostSaveStatusEnum) {
        switch (status) {
            case PostSaveStatusEnum.REQUEST_RECEIVED:
                document.querySelector("#result")!.innerHTML = "REQUEST_RECEIVED";
                break;
            case PostSaveStatusEnum.POST_UPDATED:
                document.querySelector("#result")!.innerHTML = "POST_REPLACED";
                break;
        }
    }

    private handlePostCreateStatusChange(status: PostCreateStatusEnum) {
        switch (status) {
            case PostCreateStatusEnum.REQUEST_RECEIVED:
                document.querySelector("#result")!.innerHTML = "REQUEST_RECEIVED";
                break;
            case PostCreateStatusEnum.POST_CREATED:
                document.querySelector("#result")!.innerHTML = "POST_CREATED";
                break;
            case PostCreateStatusEnum.MEDIA_SET_UPLOADED:
                document.querySelector("#result")!.innerHTML = "MEDIA_SET_UPLOADED";
                break;
            case PostCreateStatusEnum.ATTACHMENTS_UPLOADED:
                document.querySelector("#result")!.innerHTML = "ATTACHMENTS_UPLOADED";
                break;
            case PostCreateStatusEnum.MEDIA_SET_SOURCES_CREATED:
                document.querySelector("#result")!.innerHTML = "MEDIA_SET_SOURCES_CREATED";
                break;
            case PostCreateStatusEnum.ATTACHMENTS_SOURCES_CREATED:
                document.querySelector("#result")!.innerHTML = "ATTACHMENTS_SOURCES_CREATED";
                break;
        }
    }
}
