import {Media} from "./media.model";
import {Tag} from "./tag.model";
import {Attachment} from "./attachment.model";
import {Artist} from "./artist.model";

export interface Post {
    postId: string;
    title: string;
    description: string;
    mediaSet: Media[];
    attachments: Attachment[];
    tags: Tag[];
    artists: Artist[];
    updateDate: Date;
    createDate: Date;
}
