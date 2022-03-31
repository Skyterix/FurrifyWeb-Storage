import {Source} from './source.model';

export interface Attachment {
    attachmentId: string;
    fileUri: string;
    fileHash: string;
    filename: string;
    sources: Source[];
    extension: string;
}
