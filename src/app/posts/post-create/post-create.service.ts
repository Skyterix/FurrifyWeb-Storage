import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PostCreateService {

    postCreateOpenEvent: EventEmitter<void> = new EventEmitter<void>();
    postCreateCloseEvent: EventEmitter<void> = new EventEmitter<void>();

    postInfoStepOpenEvent: EventEmitter<void> = new EventEmitter<void>();
    postContentStepOpenEvent: EventEmitter<void> = new EventEmitter<void>();
    postUploadStepOpenEvent: EventEmitter<void> = new EventEmitter<void>();

    tagCreateOpenEvent: EventEmitter<string> = new EventEmitter<string>();
    tagCreateCloseEvent: EventEmitter<void> = new EventEmitter<void>();

    artistCreateOpenEvent: EventEmitter<string> = new EventEmitter<string>();
    artistCreateCloseEvent: EventEmitter<void> = new EventEmitter<void>();

    constructor() {
    }
}
