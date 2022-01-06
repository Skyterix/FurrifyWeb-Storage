import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SourceCreateService {

    lastSelectedSourceStrategy: string | undefined;

    constructor() {
    }
}
