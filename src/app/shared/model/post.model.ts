import {Media} from "./media.model";
import {Tag} from "./tag.model";

export interface Post {
    postId: string;
    title: string;
    description: string;
    mediaSet: Media[];
    //attachments: Attachment[];
    tags: Tag[];
    //creators: Creator[];
    updateDate: Date;
    createDate: Date;
}
