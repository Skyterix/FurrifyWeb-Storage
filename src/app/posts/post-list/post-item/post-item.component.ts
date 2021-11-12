import {Component, Input, OnInit} from '@angular/core';
import {Post} from "../../../shared/model/post.model";
import {PostUtils} from "../../../shared/util/post.utils";
import {Tag} from "../../../shared/model/tag.model";
import {TagUtils} from "../../../shared/util/tag.utils";
import {faVideo} from "@fortawesome/free-solid-svg-icons/faVideo";
import {faBook} from "@fortawesome/free-solid-svg-icons/faBook";
import {faImage} from "@fortawesome/free-solid-svg-icons/faImage";
import {MediaUtils} from "../../../shared/util/media.utils";
import {MediaType} from "../../../shared/enum/media-type.enum";
import {PostsService} from "../../posts.service";
import {Store} from "@ngrx/store";
import * as fromApp from "../../../store/app.reducer";
import {selectPost} from "../../store/posts.actions";

@Component({
    selector: 'app-post-item',
    templateUrl: './post-item.component.html',
    styleUrls: ['./post-item.component.css']
})
export class PostItemComponent implements OnInit {

    @Input() post!: Post;

    thumbnailUri!: string;

    movieTags!: Tag[];
    characterTags!: Tag[];

    imageIcon = faImage;
    videoIcon = faVideo;
    bookIcon = faBook;

    imageType = MediaType.IMAGE;

    constructor(private postsService: PostsService, private store: Store<fromApp.AppState>) {
    }

    ngOnInit(): void {
        this.thumbnailUri = PostUtils.getPostThumbnailUrlFromMediaSet(this.post.mediaSet)!;

        this.movieTags = TagUtils.filterTagsByType("MOVIE", this.post.tags);
        this.characterTags = TagUtils.filterTagsByType("CHARACTER", this.post.tags);
    }

    mediaContains(type: MediaType): boolean {
        return MediaUtils.containsType(type, this.post.mediaSet);
    }

    searchPosts(): void {
        // Let router link act out first
        setTimeout(() => {
            this.postsService.triggerSearch();
        });
    }

    selectPost(post: Post): void {
        this.store.dispatch(
            selectPost({
                post: post
            })
        );
    }
}
