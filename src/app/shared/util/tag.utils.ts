import {Tag} from "../model/tag.model";
import {TagPriorityConfig} from "../config/tag-priority";

export class TagUtils {
    static filterTagsByType(type: string, tags: Tag[]): Tag[] {
        return tags.filter(tag => tag.type == type);
    }

    static sortTagsByPriority(tags: Tag[]): Tag[] {
        return tags.sort((one, two) => {
            const onePriority = TagPriorityConfig.getTagPriorityByStrategy(one.type);
            const twoPriority = TagPriorityConfig.getTagPriorityByStrategy(two.type);

            return (onePriority > twoPriority ? -1 : 1);
        });
    }
}
