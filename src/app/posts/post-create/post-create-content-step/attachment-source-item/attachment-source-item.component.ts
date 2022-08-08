import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import {Store} from "@ngrx/store";
import * as fromApp from "../../../../store/app.reducer";
import {CreateSource} from "../../../../shared/model/request/create-source.model";
import {removeSourceFromAttachment} from "../../store/post-create.actions";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-attachment-source-item',
    templateUrl: './attachment-source-item.component.html',
    styleUrls: ['./attachment-source-item.component.css']
})
export class AttachmentSourceItemComponent implements OnInit, OnDestroy {

    @Input() source!: CreateSource;
    @Input() sourceIndex!: number;
    @Input() attachmentIndex!: number;

    faTimes = faTimes;

    strategyName!: string;
    // Param uniquely identification record in strategy data
    url!: string;

    private isFetching = false;
    private postCreateStoreSubscription!: Subscription;

    constructor(private store: Store<fromApp.AppState>) {
    }

    ngOnInit(): void {
        this.postCreateStoreSubscription = this.store.select('postCreate').subscribe(state => {
            this.isFetching = state.currentlyFetchingCount > 0;
        });

        this.strategyName = this.source.strategy.replace("SourceStrategy", "");
        this.url = this.source.data['url'];
    }

    ngOnDestroy(): void {
        this.postCreateStoreSubscription.unsubscribe();
    }

    onRemove(): void {
        if (this.isFetching) {
            return;
        }

        this.store.dispatch(removeSourceFromAttachment({
            attachmentIndex: this.attachmentIndex,
            sourceIndex: this.sourceIndex
        }))
    }
}
