export interface Media {
    mediaId: string;
    postId: string;
    ownerId: string;
    priority: number;
    filename: string;
    extension: string;
    fileUri: string;
    thumbnailUri: string;
    md5: string;
    createDate: Date;
}
