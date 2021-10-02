import {Source} from './source.model';

export interface Artist {
    artistId: string;
    ownerId: string;
    nicknames: string[];
    preferredNickname: string;
    sources: Source[];
    createDate: Date;
}
