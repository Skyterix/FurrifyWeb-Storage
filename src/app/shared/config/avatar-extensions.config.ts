import {AvatarType} from "../enum/avatar-type.enum";

export class AvatarExtensionsConfig {

    public static readonly PREFIX = "EXTENSION_";

    public static readonly IMAGES = [
        'png',
        'jpg',
        'jpeg'
    ];

    public static getTypeByExtension(extension: string): AvatarType | null {
        extension = extension.replace(this.PREFIX, "").toLowerCase();

        if (this.IMAGES.includes(extension)) {
            return AvatarType.IMAGE;
        }

        return null;
    }

}
