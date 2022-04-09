import {Component, Input, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import * as fromApp from "../../../../store/app.reducer";
import {removeArtistSourceStart} from "../../store/post-create.actions";
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import {KeycloakProfile} from "keycloak-js";
import {Subscription} from "rxjs";
import {QuerySource} from "../../../../shared/model/query/query-source.model";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons/faCircleNotch";

@Component({
    selector: 'app-artist-source-item',
    templateUrl: './artist-source-item.component.html',
    styleUrls: ['./artist-source-item.component.css']
})
export class ArtistSourceItemComponent implements OnInit {

    rightIcon = faTimes;

    @Input() source!: QuerySource;
    @Input() artistId!: string;

    strategyName!: string;
    // Param uniquely identification record in strategy data
    firstParam!: string;

    private currentUser!: KeycloakProfile | null;
    private authenticationStoreSubscription!: Subscription;

    constructor(private store: Store<fromApp.AppState>) {
    }

    ngOnInit(): void {
        this.strategyName = this.source.strategy.replace("SourceStrategy", "");
        this.firstParam = this.source.data[Object.keys(this.source.data)[0]];
        this.authenticationStoreSubscription = this.store.select('authentication').subscribe(state => {
            this.currentUser = state.currentUser;
        });

        this.rightIcon = (this.source.isFetching) ? faCircleNotch : faTimes;
    }

    onRemove(): void {
        this.store.dispatch(removeArtistSourceStart({
            userId: this.currentUser?.id!,
            artistId: this.artistId,
            sourceId: this.source.sourceId
        }));
    }

}
