import {Source} from "./source.model";

export interface Media {
    mediaId: string;
    postId: string;
    ownerId: string;
    priority: number;
    filename: string;
    extension: string;
    sources: Source[];
    fileUrl: string;
    thumbnailUrl: string;
    md5: string;
    createDate: Date;
}
