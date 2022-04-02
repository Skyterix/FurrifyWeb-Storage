import {EventEmitter, Injectable} from '@angular/core';
import {QueryPost} from "../../model/query/query-post.model";
import {QueryArtist} from "../../model/query/query-artist.model";

@Injectable({
    providedIn: 'root'
})
export class ConfirmationsService {

    postDeleteConfirmationOpenEvent: EventEmitter<QueryPost> = new EventEmitter<QueryPost>();
    artistDeleteConfirmationOpenEvent: EventEmitter<QueryArtist> = new EventEmitter<QueryArtist>();
    clearConfirmationModalEvent: EventEmitter<void> = new EventEmitter<void>();

    constructor() {
    }
}
