import {Media} from "../model/media.model";
import {MediaExtensionsConfig} from "../config/media-extensions.config";
import {MediaType} from "../enum/media-type.enum";

export class MediaUtils {
    static getHighestPriorityMedia(mediaSet: Media[]): Media | null {
        if (!mediaSet) {
            return null;
        }

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
            extension = extension.replace(MediaExtensionsConfig.PREFIX, "").toLowerCase();

            return MediaExtensionsConfig.getExtensionsByType(type).includes(extension);
        });
    }

    static sortByPriority(mediaSet: Media[]): Media[] {
        return mediaSet.sort((one, two) =>
            (one.priority > two.priority ? -1 : 1)
        );
    }
}
