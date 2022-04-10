import {Injectable} from '@angular/core';
import {ArtistWrapper, AttachmentWrapper, MediaWrapper} from "./store/post-create.reducer";

@Injectable({
    providedIn: 'root'
})
export class SourceCreateService {

    lastMediaSourceStrategy: string | undefined;
    lastAttachmentSourceStrategy: string | undefined;
    lastArtistSourceStrategy: string | undefined;

    constructor() {
    }

    isAttachmentSourceDuplicate(strategy: string, data: any, attachment: AttachmentWrapper): boolean {
        const result = attachment.sources.find(source => {
            return source.strategy === strategy && JSON.stringify(source.data) === JSON.stringify(data);
        });

        return !!result;
    }

    isMediaSourceDuplicate(strategy: string, data: any, media: MediaWrapper): boolean {
        const result = media.sources.find(source => {
            return source.strategy === strategy && JSON.stringify(source.data) === JSON.stringify(data);
        });

        return !!result;
    }

    isArtistSourceDuplicate(strategy: string, data: any, artist: ArtistWrapper): boolean {
        const result = artist.sources.find(source => {
            return source.strategy === strategy && JSON.stringify(source.data) === JSON.stringify(data);
        });

        return !!result;
    }

}
