import {
    AttachmentSourceDeviantArtComponent
} from "../../posts/post-create/attachment-source-create/attachment-source-deviant-art/attachment-source-deviant-art.component";

export class AttachmentSourceStrategyConfig {
    static getTemplateComponent(strategy: string): any {
        switch (strategy) {
            case 'DeviantArtV1SourceStrategy':
                return AttachmentSourceDeviantArtComponent;
        }
    }
}
