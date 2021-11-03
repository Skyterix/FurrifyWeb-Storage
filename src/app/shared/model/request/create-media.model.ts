import {Source} from "../source.model";

export class CreateMedia {
    constructor(public priority: number,
                public extension: string,
                public sources: Source[]) {
    }

}
