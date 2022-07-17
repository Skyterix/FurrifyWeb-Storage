import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {faCircleNotch, faTimes} from "@fortawesome/free-solid-svg-icons";
import {Store} from "@ngrx/store";
import {PostCreateService} from "../post-create.service";
import * as fromApp from '../../../store/app.reducer';
import {Subscription} from "rxjs";
import {take} from "rxjs/operators";
import {KeycloakProfile} from "keycloak-js";
import {ArtistWrapper, TagWrapper, WrapperSourcesFetchingStatus, WrapperStatus} from "../store/post-create.reducer";
import {
    addArtistToSelectedSetStart,
    addTagToSelectedSetStart,
    removeArtistFromSelected,
    removeTagFromSelected,
    updatePostSavedDescription,
    updatePostSavedTitle
} from "../store/post-create.actions";

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
    artistSelectForm: FormGroup;

    selectedTags!: TagWrapper[];
    selectedArtists!: ArtistWrapper[];

    readonly WrapperStatus = WrapperStatus;
    readonly WrapperSourcesFetchingStatus = WrapperSourcesFetchingStatus;

    private currentUser!: KeycloakProfile | null;
    private postCreateStoreSubscription!: Subscription;
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

        // Artist form
        this.artistSelectForm = new FormGroup({
            artist: new FormControl(null, [Validators.required])
        });
    }

    ngOnInit(): void {
        this.postCreateStoreSubscription = this.store.select('postCreate').subscribe(state => {
            this.isFetching = state.isFetching;
            this.selectedTags = state.selectedTags;
            this.selectedArtists = state.selectedArtists;
        });

        this.authenticationStoreSubscription = this.store.select('authentication').subscribe(state => {
            this.currentUser = state.currentUser;
        });

        // Initialize values
        this.store.select('postCreate').pipe(take(1)).subscribe(state => {
            this.postInfoForm.setValue({
                title: state.postSavedTitle,
                description: state.postSavedDescription,
            });
        }).unsubscribe()
    }

    ngOnDestroy(): void {
        this.postCreateStoreSubscription.unsubscribe();
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
        if (this.isFetching || tagWrapper.status !== WrapperStatus.NOT_FOUND) {
            return;
        }

        this.postCreateService.tagCreateOpenEvent.emit(tagWrapper.tag.value);
    }

    loadCreateArtistForm(artistWrapper: ArtistWrapper): void {
        if (this.isFetching || artistWrapper.status !== WrapperStatus.NOT_FOUND) {
            return;
        }

        this.postCreateService.artistCreateOpenEvent.emit(artistWrapper.artist.preferredNickname);
    }

    onTagRemove(tagWrapper: TagWrapper): void {
        this.store.dispatch(removeTagFromSelected({
            tag: tagWrapper.tag
        }));
    }

    onTagSelectSubmit(): void {
        const tagValue: string = this.tagSelectForm.controls.tag.value
            .trim()
            .toLowerCase()
            // Replace spaces with underscore
            .replace(/ /g, "_");

        if (!tagValue) {
            return;
        }

        if (!tagValue.match("^[a-zA-Z0-9_-]*$")) {
            return;
        }

        if (tagValue.length > 64) {
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

    onArtistRemove(artistWrapper: ArtistWrapper): void {
        this.store.dispatch(removeArtistFromSelected({
            artist: artistWrapper.artist
        }));
    }

    onArtistSelectSubmit(): void {
        const artistNickname: string = this.artistSelectForm.controls.artist.value
            .trim();

        if (!artistNickname) {
            return;
        }

        if (!artistNickname.match("^[a-zA-Z0-9_-]*$")) {
            return;
        }


        if (artistNickname.length > 256) {
            return;
        }

        // Check if artist already exists
        const isDuplicate = this.selectedArtists.find((artistWrapper) => {
            return artistWrapper.artist.preferredNickname.toLowerCase() === artistNickname.toLowerCase();
        });

        if (!isDuplicate) {
            this.store.dispatch(addArtistToSelectedSetStart(
                {
                    userId: this.currentUser!.id!,
                    preferredNickname: artistNickname
                }
            ));

            this.artistSelectForm.setValue({
                artist: ''
            });
        }
    }

    loadCreateArtistSourceForm(artistWrapper: ArtistWrapper): void {
        this.postCreateService.artistSourceCreateOpenEvent.emit(artistWrapper);
    }
}
