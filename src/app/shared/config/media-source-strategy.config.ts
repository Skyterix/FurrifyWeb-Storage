import {
    MediaSourceDeviantArtComponent
} from "../../posts/post-create/source-create/media-source-deviantart/media-source-deviant-art.component";

export class MediaSourceStrategyConfig {
    static getTemplateComponent(strategy: string): any {
        switch (strategy) {
            case 'DeviantArtV1SourceStrategy':
                return MediaSourceDeviantArtComponent;
        }
    }
}
