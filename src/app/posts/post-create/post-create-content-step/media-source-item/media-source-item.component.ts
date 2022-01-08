import {Component, Input, OnInit} from '@angular/core';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import {Store} from "@ngrx/store";
import * as fromApp from "../../../../store/app.reducer";
import {removeSourceFromMedia} from "../../../store/posts.actions";
import {CreateSource} from "../../../../shared/model/request/create-source.model";

@Component({
    selector: 'app-media-source-item',
    templateUrl: './media-source-item.component.html',
    styleUrls: ['./media-source-item.component.css']
})
export class MediaSourceItemComponent implements OnInit {

    @Input() source!: CreateSource;
    @Input() sourceIndex!: number;
    @Input() mediaIndex!: number;

    faTimes = faTimes;

    strategyName!: string;
    // Param uniquely identification record in strategy data
    firstParam!: string;

    constructor(private store: Store<fromApp.AppState>) {
    }

    ngOnInit(): void {
        this.strategyName = this.source.strategy.replace("SourceStrategy", "");
        this.firstParam = this.source.data[Object.keys(this.source.data)[0]];
    }

    onRemove(): void {
        this.store.dispatch(removeSourceFromMedia({
            mediaIndex: this.mediaIndex,
            sourceIndex: this.sourceIndex
        }))
    }
}
