import {
    AttachmentSourceDeviantArtComponent
} from "../../posts/post-create/attachment-source-create/attachment-source-deviant-art/attachment-source-deviant-art.component";
import {
    AttachmentSourcePatreonComponent
} from "../../posts/post-create/attachment-source-create/attachment-source-patreon/attachment-source-patreon.component";

export class AttachmentSourceStrategyConfig {
    static getTemplateComponent(strategy: string): any {
        switch (strategy) {
            case 'DeviantArtV1SourceStrategy':
                return AttachmentSourceDeviantArtComponent;
            case 'PatreonV1SourceStrategy':
                return AttachmentSourcePatreonComponent;
        }
    }
}
