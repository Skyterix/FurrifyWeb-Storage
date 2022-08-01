import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import {Store} from "@ngrx/store";
import * as fromApp from "../../../../store/app.reducer";
import {CreateSource} from "../../../../shared/model/request/create-source.model";
import {removeSourceFromMedia} from "../../store/post-create.actions";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-media-source-item',
    templateUrl: './media-source-item.component.html',
    styleUrls: ['./media-source-item.component.css']
})
export class MediaSourceItemComponent implements OnInit, OnDestroy {

    @Input() source!: CreateSource;
    @Input() sourceIndex!: number;
    @Input() mediaIndex!: number;

    faTimes = faTimes;

    strategyName!: string;
    // Param uniquely identification record in strategy data
    firstParam!: string;

    private isFetching = false;
    private postCreateStoreSubscription!: Subscription;

    constructor(private store: Store<fromApp.AppState>) {
    }

    ngOnInit(): void {
        this.postCreateStoreSubscription = this.store.select('postCreate').subscribe(state => {
            this.isFetching = state.currentlyFetchingCount > 0;
        });

        this.strategyName = this.source.strategy.replace("SourceStrategy", "");
        this.firstParam = this.source.data[Object.keys(this.source.data)[0]];
    }

    ngOnDestroy(): void {
        this.postCreateStoreSubscription.unsubscribe();
    }

    onRemove(): void {
        if (this.isFetching) {
            return;
        }

        this.store.dispatch(removeSourceFromMedia({
            mediaIndex: this.mediaIndex,
            sourceIndex: this.sourceIndex
        }))
    }
}
