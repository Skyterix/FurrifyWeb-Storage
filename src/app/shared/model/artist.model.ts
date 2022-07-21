import {Source} from './source.model';
import {Avatar} from "./avatar.model";

export interface Artist {
    artistId: string;
    ownerId: string;
    nicknames: string[];
    preferredNickname: string;
    avatar: Avatar | null;
    sources: Source[];
    createDate: Date | undefined;
}
