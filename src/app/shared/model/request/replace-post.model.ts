import {Tag} from "../tag.model";
import {Artist} from "../artist.model";

export class ReplacePost {
    constructor(public title: string,
                public description: string,
                public artists: Artist[],
                public tags: Tag[]) {
    }

}
