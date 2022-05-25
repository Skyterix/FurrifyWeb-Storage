import {QueryAvatar} from "./query-avatar.model";

export interface QueryArtist {
    artistId: string;
    ownerId: string;
    nicknames: string[];
    preferredNickname: string;
    avatar: QueryAvatar;
}
