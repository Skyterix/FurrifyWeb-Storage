import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PostCreateService {

    postCreateOpenEvent: EventEmitter<void> = new EventEmitter<void>();
    postCreateCloseEvent: EventEmitter<void> = new EventEmitter<void>();

    constructor() {
    }
}
