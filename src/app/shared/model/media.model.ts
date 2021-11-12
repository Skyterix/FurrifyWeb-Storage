import {Source} from "./source.model";

export interface Media {
    mediaId: string;
    postId: string;
    ownerId: string;
    priority: number;
    filename: string;
    extension: string;
    sources: Source[];
    fileUri: string;
    thumbnailUri: string;
    md5: string;
    createDate: Date;
}
