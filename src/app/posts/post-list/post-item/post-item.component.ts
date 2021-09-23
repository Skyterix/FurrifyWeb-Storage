import {Component, Input, OnInit} from '@angular/core';
import {Post} from "../../../shared/model/post.model";
import {PostUtils} from "../../../shared/post.utils";
import {Tag} from "../../../shared/model/tag.model";
import {TagUtils} from "../../../shared/tag.utils";
import {faVideo} from "@fortawesome/free-solid-svg-icons/faVideo";
import {faBook} from "@fortawesome/free-solid-svg-icons/faBook";
import {faImage} from "@fortawesome/free-solid-svg-icons/faImage";
import {MediaUtils} from "../../../shared/media.utils";
import {MediaType} from "../../../shared/enum/media-type.enum";

@Component({
    selector: 'app-post-item',
    templateUrl: './post-item.component.html',
    styleUrls: ['./post-item.component.css']
})
export class PostItemComponent implements OnInit {

    @Input() post!: Post;

    thumbnailUrl!: string;

    movieTags!: Tag[];
    characterTags!: Tag[];

    imageIcon = faImage;
    videoIcon = faVideo;
    bookIcon = faBook;

    imageType = MediaType.IMAGE;

    constructor() {
    }

    ngOnInit(): void {
        this.thumbnailUrl = PostUtils.getPostThumbnailUrlFromMediaSet(this.post.mediaSet)!;

        this.movieTags = TagUtils.filterTagsByType("MOVIE", this.post.tags);
        this.characterTags = TagUtils.filterTagsByType("CHARACTER", this.post.tags);
    }

    mediaContains(type: MediaType): boolean {
        return MediaUtils.containsType(type, this.post.mediaSet);
    }

}
