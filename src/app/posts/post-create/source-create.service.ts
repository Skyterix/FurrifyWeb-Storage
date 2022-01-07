import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SourceCreateService {

    lastMediaSourceStrategy: string | undefined;
    lastAttachmentSourceStrategy: string | undefined;

    constructor() {
    }
}
