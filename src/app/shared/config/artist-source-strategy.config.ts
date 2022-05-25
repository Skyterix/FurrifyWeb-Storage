import {
    ArtistSourceDeviantArtComponent
} from "../../posts/post-create/artist-source-create/artist-source-deviant-art/artist-source-deviant-art.component";
import {
    ArtistSourcePatreonComponent
} from "../../posts/post-create/artist-source-create/artist-source-patreon/artist-source-patreon.component";

export class ArtistSourceStrategyConfig {
    static getTemplateComponent(strategy: string): any {
        switch (strategy) {
            case 'DeviantArtV1SourceStrategy':
                return ArtistSourceDeviantArtComponent;
            case 'PatreonV1SourceStrategy':
                return ArtistSourcePatreonComponent;
        }
    }
}
