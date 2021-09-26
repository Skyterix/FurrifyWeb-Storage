import {MediaType} from "../enum/media-type.enum";

export class MediaExtensionsConfig {

    private static IMAGES = [
        'png',
        'jpeg',
        'jpg'
    ];

    public static getExtensionsByType(type: MediaType): string[] {
        switch (type) {
            case MediaType.IMAGE:
                return this.IMAGES;
            default:
                return [];
        }
    }
}
