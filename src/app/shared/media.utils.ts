import {Media} from "./model/media.model";
import {MediaExtensionsConfig} from "./config/media-extensions.config";
import {MediaType} from "./enum/media-type.enum";

export class MediaUtils {
    static getHighestPriorityMedia(mediaSet: Media[]): Media | null {
        const highestPriority = Math.max.apply(Math, mediaSet.map(o => o.priority));

        const media: Media | undefined = mediaSet.find(o => o.priority === highestPriority);

        if (!media) {
            return null;
        }

        return media;
    }

    static containsType(type: MediaType, mediaSet: Media[]): boolean {
        const postMediaExtensions = mediaSet.map((media) => media.extension);

        return postMediaExtensions.some((extension) => {
            return MediaExtensionsConfig.getExtensionsByType(type).includes(extension);
        });
    }
}
