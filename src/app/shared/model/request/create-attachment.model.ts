import {Source} from "../source.model";

export class CreateAttachment {
    constructor(public extension: string,
                public sources: Source[]) {
    }

}
