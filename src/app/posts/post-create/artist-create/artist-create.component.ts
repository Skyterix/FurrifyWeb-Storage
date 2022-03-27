import {Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
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
import {faUpload} from "@fortawesome/free-solid-svg-icons/faUpload";
import {EXTENSION_EXTRACT_REGEX, FILENAME_REGEX} from "../../../shared/config/common.constats";
import {AvatarExtensionsConfig} from "../../../shared/config/avatar-extensions.config";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";

@Component({
    selector: 'app-artist-create',
    templateUrl: './artist-create.component.html',
    styleUrls: ['./artist-create.component.css']
})
export class ArtistCreateComponent implements OnInit {

    uploadIcon = faUpload;
    spinnerIcon = faCircleNotch;
    plusIcon = faPlus;

    @Input() preferredNickname!: string;

    @ViewChild('article', {read: ElementRef}) articleRef!: ElementRef;

    errorMessage!: string;
    isFetching!: boolean;

    selectedFile!: File;

    createArtistForm!: FormGroup;
    selectNicknameForm!: FormGroup;
    artistAvatarFileForm!: FormGroup;

    currentUser!: KeycloakProfile | null;

    selectedSources: Source[] = [];
    selectedNicknames: string[] = [];

    private postsStoreSubscription!: Subscription;
    private authenticationStoreSubscription!: Subscription;

    constructor(private store: Store<fromApp.AppState>,
                private postCreateService: PostCreateService,
                private renderer: Renderer2) {
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
            nickname: new FormControl(null)
        });
        // Add file form
        this.artistAvatarFileForm = new FormGroup({
            avatarFile: new FormControl(null, [Validators.required])
        });
    }

    ngOnDestroy(): void {
        this.postsStoreSubscription.unsubscribe();
        this.authenticationStoreSubscription.unsubscribe()
    }

    onSubmit(): void {
        // Concat nicknames into one array
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
            artist: newArtist,
            avatar: this.selectedFile
        }));
    }


    onClose(): void {
        this.renderer.addClass(this.articleRef.nativeElement, "animate__fadeOut");

        // Let the animation finish
        setTimeout(() => {
            this.postCreateService.clearPostCreateSideStepModalEvent.emit();
        }, 100);
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

    onFileSelected(event: any) {
        this.errorMessage = "";

        // If file is not selected
        if (event.target.files.length === 0) {
            return;
        }

        // Is filename is invalid
        if (!FILENAME_REGEX.test(event.target.files[0].name)) {
            this.errorMessage = "File \"" + event.target.files[0].name + "\" has invalid name."

            this.artistAvatarFileForm.reset();
        }

        const extension = EXTENSION_EXTRACT_REGEX.exec(event.target.files[0].name);

        /* Check extension against accepted extensions list.
           The check for null is not required, regex check above ensures that extension must be present. */
        if (!AvatarExtensionsConfig.EXTENSIONS.includes(extension![1].toLowerCase())) {
            this.errorMessage = "File \"" + event.target.files[0].name + "\" has extension which is not accepted as avatar."

            this.artistAvatarFileForm.reset();
        }

        this.selectedFile = event.target.files[0];
    }
}
