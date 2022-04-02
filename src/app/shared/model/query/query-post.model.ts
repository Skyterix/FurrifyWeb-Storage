import {Media} from "../media.model";
import {Attachment} from "../attachment.model";
import {Tag} from "../tag.model";
import {QueryPostArtist} from "./query-post-artist.model";

export interface QueryPost {
    postId: string;
    title: string;
    description: string;
    mediaSet: Media[];
    attachments: Attachment[];
    tags: Tag[];
    artists: QueryPostArtist[];
    createDate: Date;
}
