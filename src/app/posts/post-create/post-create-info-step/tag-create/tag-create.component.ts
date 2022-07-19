import {Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import {PostCreateService} from "../../post-create.service";
import * as fromApp from '../../../../store/app.reducer';
import {TagTypesConfig} from "../../../../shared/config/tag-types.config";
import {Tag} from "../../../../shared/model/tag.model";
import {KeycloakProfile} from "keycloak-js";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons";
import {createTagStart} from "../../store/post-create.actions";

@Component({
    selector: 'app-tag-create',
    templateUrl: './tag-create.component.html',
    styleUrls: ['./tag-create.component.css']
})
export class TagCreateComponent implements OnInit, OnDestroy {

    @ViewChild('article', {read: ElementRef}) articleRef!: ElementRef;

    spinnerIcon = faCircleNotch;

    @Input() value!: string;

    errorMessage!: string | null;
    isFetching!: boolean;

    createTagForm!: FormGroup;

    types = TagTypesConfig.TYPES;

    currentUser!: KeycloakProfile | null;

    private postCreateStoreSubscription!: Subscription;
    private authenticationStoreSubscription!: Subscription;

    constructor(private store: Store<fromApp.AppState>,
                private postCreateService: PostCreateService,
                private renderer: Renderer2) {
    }

    ngOnInit(): void {
        this.postCreateStoreSubscription = this.store.select('postCreate').subscribe(state => {
            this.isFetching = state.isFetching;
            this.errorMessage = state.tagErrorMessage;
        });
        this.authenticationStoreSubscription = this.store.select('authentication').subscribe(state => {
            this.currentUser = state.currentUser;
        });

        this.createTagForm = new FormGroup({
            value: new FormControl({value: this.value, disabled: true}),
            title: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
            type: new FormControl(this.types[0], [Validators.required])
        });
    }

    ngOnDestroy(): void {
        this.postCreateStoreSubscription.unsubscribe();
        this.authenticationStoreSubscription.unsubscribe();
    }

    onSubmit(): void {
        const newTag: Tag = {
            title: this.createTagForm.controls.title.value,
            value: this.value,
            type: this.createTagForm.controls.type.value,
            ownerId: "",
            createDate: new Date()
        };

        this.store.dispatch(createTagStart({
            userId: this.currentUser!.id!,
            tag: newTag
        }));
    }


    onClose(): void {
        this.renderer.addClass(this.articleRef.nativeElement, "animate__fadeOut");

        // Let the animation finish
        setTimeout(() => {
            this.postCreateService.clearPostCreateSideStepModalEvent.emit();
        }, 100);
    }

}
