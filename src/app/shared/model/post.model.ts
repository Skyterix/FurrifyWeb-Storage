import {Media} from "./media.model";
import {Tag} from "./tag.model";
import {Attachment} from "./attachment.model";

export interface Post {
    postId: string;
    title: string;
    description: string;
    mediaSet: Media[];
    attachments: Attachment[];
    tags: Tag[];
    //creators: Creator[];
    updateDate: Date;
    createDate: Date;
}
