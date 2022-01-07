import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import * as fromApp from "../../../store/app.reducer";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons/faCircleNotch";
import {KeycloakProfile} from "keycloak-js";
import {PostCreateService} from "../post-create.service";
import {PostCreateStatusEnum} from "../../../shared/enum/post-create-status.enum";

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

    constructor(private store: Store<fromApp.AppState>,
                private postCreateService: PostCreateService) {
    }

    ngOnInit(): void {
        this.postsStoreSubscription = this.store.select('posts').subscribe(state => {
            this.isFetching = state.isFetching;

            this.isFormValid = this.postCreateService.isFormDataValid();
        });

        this.postCreateStatusChangeSubscription = this.postCreateService.postCreateStatusChangeEvent.subscribe(
            status => this.handlePostCreateStatusChange(status)
        );
    }

    ngOnDestroy(): void {
        this.postsStoreSubscription.unsubscribe();
        this.postCreateStatusChangeSubscription.unsubscribe();
    }

    onSubmit(): void {
        if (this.isFetching) {
            return;
        }

        this.postCreateService.createPost();
    }

    private handlePostCreateStatusChange(status: PostCreateStatusEnum) {
        switch (status) {
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
