import {EventEmitter, Injectable} from '@angular/core';
import {QueryPost} from "../../shared/model/query/query-post.model";

@Injectable({
    providedIn: 'root'
})
export class ConfirmationsService {

    postDeleteConfirmationOpenEvent: EventEmitter<QueryPost> = new EventEmitter<QueryPost>();
    clearConfirmationModalEvent: EventEmitter<void> = new EventEmitter<void>();

    constructor() {
    }
}
