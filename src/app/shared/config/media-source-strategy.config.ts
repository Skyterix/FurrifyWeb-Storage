import {
    MediaSourceDeviantArtComponent
} from "../../posts/post-create/post-create-content-step/media-source-create/media-source-deviantart/media-source-deviant-art.component";
import {
    MediaSourcePatreonComponent
} from "../../posts/post-create/post-create-content-step/media-source-create/media-source-patreon/media-source-patreon.component";

export class MediaSourceStrategyConfig {
    static getTemplateComponent(strategy: string): any {
        switch (strategy) {
            case 'DeviantArtV1SourceStrategy':
                return MediaSourceDeviantArtComponent;
            case 'PatreonV1SourceStrategy':
                return MediaSourcePatreonComponent;
        }
    }
}
