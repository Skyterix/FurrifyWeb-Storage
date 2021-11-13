import {MediaType} from "../enum/media-type.enum";

export class MediaExtensionsConfig {

    private static IMAGES = [
        'bmp',
        'bm',
        'wbmp',
        'tiff',
        'tif',
        'svg',
        'png',
        'jpeg',
        'jpg'
    ];

    private static AUDIO = [
        'ogg',
        'flac',
        'wav',
        'mp3'
    ];

    private static VIDEOS = [
        'ts',
        'mov',
        'flv',
        'avi',
        'wmv',
        'mkv',
        'webm',
        'mp4'
    ];

    private static ANIMATIONS = [
        'gif'
    ];

    public static getExtensionsByType(type: MediaType): string[] {
        switch (type) {
            case MediaType.IMAGE:
                return this.IMAGES;
            case MediaType.VIDEO:
                return this.VIDEOS;
            case MediaType.ANIMATION:
                return this.ANIMATIONS;
            case MediaType.AUDIO:
                return this.AUDIO;
            default:
                return [];
        }
    }
}
