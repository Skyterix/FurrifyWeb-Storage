import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import {CDN_ADDRESS} from "../shared/config/api.constants";
import {QueryArtist} from "../shared/model/query/query-artist.model";

@Component({
    selector: 'app-artists',
    templateUrl: './artists.component.html',
    styleUrls: ['./artists.component.css']
})
export class ArtistsComponent implements OnInit, AfterViewInit {

    @ViewChild('background', {read: ElementRef}) backgroundRef!: ElementRef;
    @ViewChild('defaultBackground', {read: ElementRef}) defaultBackgroundRef!: ElementRef;

    private selectedArtist!: QueryArtist | null;
    private storeSubscription!: Subscription;

    constructor(private store: Store<fromApp.AppState>,
                private renderer: Renderer2) {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.storeSubscription = this.store.select('artists').subscribe(state => {
            // If selected post changed
            if (this.selectedArtist !== state.selectedArtist) {
                this.selectedArtist = state.selectedArtist;

                this.loadBackground();
            }
        });
    }

    ngOnDestroy(): void {
        this.storeSubscription.unsubscribe();
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
