import {Media} from "./model/media.model";
import {MediaUtils} from "./media.utils";

export class PostUtils {
    static getPostThumbnailUrlFromMediaSet(mediaSet: Media[]): string | null {
        const media = MediaUtils.getHighestPriorityMedia(mediaSet);

        if (!media) {
            return 'assets/no-thumbnail.jpg';
        } else {
            return media.thumbnailUrl;
        }
    }
}
