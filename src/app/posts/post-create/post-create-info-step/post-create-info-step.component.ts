import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {faCircleNotch, faTimes} from "@fortawesome/free-solid-svg-icons";
import {Store} from "@ngrx/store";
import {PostCreateService} from "../post-create.service";
import * as fromApp from '../../../store/app.reducer';
import {Subscription} from "rxjs";
import {
    addTagToSelectedSetStart,
    removeTagFromSelected,
    updatePostSavedDescription,
    updatePostSavedTitle
} from "../../store/posts.actions";
import {take} from "rxjs/operators";
import {TagWrapper} from "../../store/posts.reducer";
import {KeycloakProfile} from "keycloak-js";

@Component({
    selector: 'app-post-create-info-step',
    templateUrl: './post-create-info-step.component.html',
    styleUrls: ['./post-create-info-step.component.css']
})
export class PostCreateInfoStepComponent implements OnInit, OnDestroy {

    spinnerIcon = faCircleNotch;
    timesIcon = faTimes;

    isFetching!: boolean;

    postInfoForm: FormGroup;
    tagSelectForm: FormGroup;

    selectedTags!: TagWrapper[];

    private currentUser!: KeycloakProfile | null;

    private postsStoreSubscription!: Subscription;
    private authenticationStoreSubscription!: Subscription;

    constructor(private postCreateService: PostCreateService,
                private store: Store<fromApp.AppState>) {
        // Info form
        this.postInfoForm = new FormGroup({
            title: new FormControl(null, [Validators.required]),
            description: new FormControl(null)
        });

        // Tag form
        this.tagSelectForm = new FormGroup({
            tag: new FormControl(null, [Validators.required])
        });
    }

// TODO Error message
    ngOnInit(): void {
        this.postsStoreSubscription = this.store.select('posts').subscribe(state => {
            this.isFetching = state.isFetching;
            this.selectedTags = state.selectedTags;
        });

        this.authenticationStoreSubscription = this.store.select('authentication').subscribe(state => {
            this.currentUser = state.currentUser;
        });

        // Initialize values
        this.store.select('posts').pipe(take(1)).subscribe(state => {
            this.postInfoForm.setValue({
                title: state.postSavedTitle,
                description: state.postSavedDescription,
            });
        }).unsubscribe()
    }

    ngOnDestroy(): void {
        this.postsStoreSubscription.unsubscribe();
        this.authenticationStoreSubscription.unsubscribe();
    }

    onTitleValueChange(): void {
        this.store.dispatch(
            updatePostSavedTitle({
                title: this.postInfoForm.controls.title.value
            })
        );
    }

    onDescriptionValueChange(): void {
        this.store.dispatch(
            updatePostSavedDescription(
                {
                    description: this.postInfoForm.controls.description.value
                }
            )
        );
    }

    onNextStep(): void {
        this.postCreateService.postContentStepOpenEvent.emit();
    }

    loadCreateTagForm(tagWrapper: TagWrapper): void {
        if (this.isFetching || !!tagWrapper.isExisting) {
            return;
        }

        this.postCreateService.tagCreateOpenEvent.emit(tagWrapper.tag.value);
    }

    onTagRemove(tagWrapper: TagWrapper): void {
        this.store.dispatch(removeTagFromSelected({
            tag: tagWrapper.tag
        }));
    }

    onTagSelectSubmit(): void {
        if (!this.tagSelectForm.controls.tag.value) {
            return;
        }

        const tagValue: string = this.tagSelectForm.controls.tag.value
            .trim()
            .toLowerCase()
            // Replace spaces with underscore
            .replace(/ /g, "_");

        if (!tagValue.match("^[a-z_-]*$")) {
            return;
        }

        // Check if tag already exists
        const isDuplicate = this.selectedTags.find((tagWrapper) => {
            return tagWrapper.tag.value === tagValue;
        });

        if (!isDuplicate) {
            this.store.dispatch(addTagToSelectedSetStart(
                {
                    userId: this.currentUser!.id!,
                    value: tagValue
                }
            ));

            this.tagSelectForm.setValue({
                tag: ''
            });
        }
    }
}
