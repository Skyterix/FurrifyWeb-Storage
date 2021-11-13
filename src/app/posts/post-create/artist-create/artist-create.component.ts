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
import {createArtistStart} from "../../store/posts.actions";

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
    selectNicknameForm!: FormGroup;

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
            this.errorMessage = state.artistErrorMessage;
        });
        this.authenticationStoreSubscription = this.store.select('authentication').subscribe(state => {
            this.currentUser = state.currentUser;
        });

        this.createArtistForm = new FormGroup({
            preferredNickname: new FormControl({value: this.preferredNickname, disabled: true})
        });
        this.selectNicknameForm = new FormGroup({
            nickname: new FormControl(null, [Validators.required])
        });
    }

    ngOnDestroy(): void {
        this.postsStoreSubscription.unsubscribe();
        this.authenticationStoreSubscription.unsubscribe()
    }

    onSubmit(): void {
        let nicknames = [...this.selectedNicknames, this.preferredNickname];

        const newArtist: Artist = {
            artistId: "",
            ownerId: "",
            nicknames: nicknames,
            preferredNickname: this.createArtistForm.controls.preferredNickname.value,
            sources: this.selectedSources,
            avatar: null,
            createDate: new Date()
        };

        this.store.dispatch(createArtistStart({
            userId: this.currentUser!.id!,
            artist: newArtist
        }));
    }


    onClose(): void {
        this.postCreateService.artistCreateCloseEvent.emit();
    }

    onArtistNicknameSelect(): void {
        const nickname = this.selectNicknameForm.controls.nickname.value;

        // If empty
        if (!nickname.trim()) {
            return;
        }

        // Check if nickname already exists
        const isDuplicate = this.selectedNicknames.find((nicknameItem) => {
            return nicknameItem === nickname;
        });

        if (isDuplicate) {
            return;
        }
        // Block adding the same nick as preferred, as it will be added programmatically later
        if (nickname === this.preferredNickname) {
            return;
        }

        this.selectedNicknames.push(nickname);

        this.selectNicknameForm.patchValue({
            nickname: ""
        })
    }

    onNicknameRemove(nicknameToRemove: string): void {
        this.selectedNicknames = this.selectedNicknames.filter(nickname => {
            return nickname !== nicknameToRemove;
        })
    }
}
