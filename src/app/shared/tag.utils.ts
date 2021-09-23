import {Tag} from "./model/tag.model";

export class TagUtils {
    static filterTagsByType(type: string, tags: Tag[]): Tag[] {
        return tags.filter(tag => tag.type == type);
    }
}
