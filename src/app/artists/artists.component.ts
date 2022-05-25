import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import {CDN_ADDRESS} from "../shared/config/api.constants";
import {QueryArtist} from "../shared/model/query/query-artist.model";
import {
    DeleteConfirmationComponent
} from "../shared/component/confirmations/post-delete-confirmation/delete-confirmation.component";
import {KeycloakProfile} from "keycloak-js";
import {ConfirmationsService} from "../shared/component/confirmations/confirmations.service";
import {deleteArtistStart} from "./store/artists.actions";

@Component({
    selector: 'app-artists',
    templateUrl: './artists.component.html',
    styleUrls: ['./artists.component.css']
})
export class ArtistsComponent implements OnInit, AfterViewInit {

    @ViewChild('modal', {read: ViewContainerRef}) modalRef!: ViewContainerRef;
    @ViewChild('background', {read: ElementRef}) backgroundRef!: ElementRef;
    @ViewChild('defaultBackground', {read: ElementRef}) defaultBackgroundRef!: ElementRef;

    private selectedArtist!: QueryArtist | null;
    private currentUser!: KeycloakProfile | null;

    private clearConfirmationModalSubscription!: Subscription;
    private postDeleteConfirmationOpenSubscription!: Subscription;
    private artistsStoreSubscription!: Subscription;
    private authenticationStoreSubscription!: Subscription;

    constructor(private store: Store<fromApp.AppState>,
                private renderer: Renderer2,
                private confirmationsService: ConfirmationsService) {
    }

    ngOnInit(): void {
        this.authenticationStoreSubscription = this.store.select('authentication').subscribe(state => {
            this.currentUser = state.currentUser;
        });

        this.clearConfirmationModalSubscription = this.confirmationsService.clearConfirmationModalEvent.subscribe(() => {
            this.clearModal();
        });
        this.postDeleteConfirmationOpenSubscription = this.confirmationsService.artistDeleteConfirmationOpenEvent.subscribe(artist => {
            this.loadArtistDeleteConfirmationModal(artist);
        });
    }

    ngAfterViewInit(): void {
        this.artistsStoreSubscription = this.store.select('artists').subscribe(state => {
            // If selected post changed
            if (this.selectedArtist !== state.selectedArtist) {
                this.selectedArtist = state.selectedArtist;

                this.loadBackground();
            }
        });
    }

    ngOnDestroy(): void {
        this.artistsStoreSubscription.unsubscribe();
        this.authenticationStoreSubscription.unsubscribe();
    }

    private loadArtistDeleteConfirmationModal(artist: QueryArtist): void {
        this.modalRef!.clear();
        const component = this.modalRef!.createComponent(DeleteConfirmationComponent);
        component.instance.onDeleteCallback = () => {
            this.store.dispatch(deleteArtistStart({
                userId: this.currentUser?.id!,
                artistId: artist.artistId
            }));
        };
    }

    private clearModal(): void {
        this.modalRef.clear();
    }

    private loadBackground(): void {
        if (!!this.selectedArtist) {
            const avatar = this.selectedArtist.avatar;
            if (!avatar) {
                return;
            }

            this.renderer.setStyle(this.defaultBackgroundRef.nativeElement, "display", "none")

            this.renderer.setStyle(this.backgroundRef.nativeElement, "background-image", "url(" + CDN_ADDRESS + avatar.thumbnailUri + ")")
            this.renderer.setStyle(this.backgroundRef.nativeElement, "opacity", "1")
        } else {
            this.renderer.setStyle(this.defaultBackgroundRef.nativeElement, "display", "block")

            this.renderer.setStyle(this.backgroundRef.nativeElement, "opacity", "0")
        }
    }

}
