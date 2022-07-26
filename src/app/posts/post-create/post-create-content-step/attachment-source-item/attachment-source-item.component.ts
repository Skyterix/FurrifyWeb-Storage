import {Component, Input, OnInit} from '@angular/core';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import {Store} from "@ngrx/store";
import * as fromApp from "../../../../store/app.reducer";
import {CreateSource} from "../../../../shared/model/request/create-source.model";
import {removeSourceFromAttachment} from "../../store/post-create.actions";

@Component({
    selector: 'app-attachment-source-item',
    templateUrl: './attachment-source-item.component.html',
    styleUrls: ['./attachment-source-item.component.css']
})
export class AttachmentSourceItemComponent implements OnInit {

    @Input() source!: CreateSource;
    @Input() sourceIndex!: number;
    @Input() attachmentIndex!: number;

    faTimes = faTimes;

    strategyName!: string;
    // Param uniquely identification record in strategy data
    url!: string;

    constructor(private store: Store<fromApp.AppState>) {
    }

    ngOnInit(): void {
        this.strategyName = this.source.strategy.replace("SourceStrategy", "");
        this.url = this.source.data['url'];
    }

    onRemove(): void {
        this.store.dispatch(removeSourceFromAttachment({
            attachmentIndex: this.attachmentIndex,
            sourceIndex: this.sourceIndex
        }))
    }
}
