import {Component, Input, OnInit} from '@angular/core';
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {KeycloakProfile} from "keycloak-js";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import * as fromApp from "../../../store/app.reducer";
import {PostCreateService} from "../post-create.service";
import {Artist} from "../../../shared/model/artist.model";
import {Source} from "../../../shared/model/source.model";

@Component({
    selector: 'app-artist-create',
    templateUrl: './artist-create.component.html',
    styleUrls: ['./artist-create.component.css']
})
export class ArtistCreateComponent implements OnInit {

    spinnerIcon = faCircleNotch;

    @Input() preferredNickname!: string;

    errorMessage!: string;
    isFetching!: boolean;

    createArtistForm!: FormGroup;

    currentUser!: KeycloakProfile | null;

    selectedSources: Source[] = [];
    selectedNicknames: string[] = [];

    private postsStoreSubscription!: Subscription;
    private authenticationStoreSubscription!: Subscription;

    constructor(private store: Store<fromApp.AppState>,
                private postCreateService: PostCreateService) {
    }

    ngOnInit(): void {
        this.postsStoreSubscription = this.store.select('posts').subscribe(state => {
            this.isFetching = state.isFetching;
            this.errorMessage = state.tagErrorMessage;
        });
        this.authenticationStoreSubscription = this.store.select('authentication').subscribe(state => {
            this.currentUser = state.currentUser;
        });

        this.createArtistForm = new FormGroup({
            preferredNickname: new FormControl({value: this.preferredNickname, disabled: true}),
            nicknames: new FormControl(null, [Validators.required])
        });
    }

    ngOnDestroy(): void {
        this.postsStoreSubscription.unsubscribe();
    }

    onSubmit(): void {
        const newArtist: Artist = {
            artistId: "",
            ownerId: "",
            nicknames: this.selectedNicknames,
            preferredNickname: this.createArtistForm.controls.preferredNickname.value,
            sources: this.selectedSources,
            createDate: new Date()
        };

        /*        this.store.dispatch(createArtistStart({
                    userId: this.currentUser!.id!,
                    artist: newArtist
                }));*/
    }


    onClose(): void {
        this.postCreateService.artistCreateCloseEvent.emit();
    }

}
