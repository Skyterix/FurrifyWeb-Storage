import {Media} from "../model/media.model";
import {MediaUtils} from "./media.utils";
import {CDN_ADDRESS} from "../config/api.constants";

export class PostUtils {
    static getPostThumbnailUrlFromMediaSet(mediaSet: Media[]): string | null {
        const media = MediaUtils.getHighestPriorityMedia(mediaSet);

        if (!media?.thumbnailUri) {
            return 'assets/no-thumbnail.jpg';
        } else {
            return CDN_ADDRESS + media.thumbnailUri;
        }
    }
}
