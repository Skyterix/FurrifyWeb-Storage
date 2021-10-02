import {Component, Input, OnInit} from '@angular/core';
import {Media} from "../../../shared/model/media.model";
import {MediaUtils} from "../../../shared/util/media.utils";
import {Post} from "../../../shared/model/post.model";
import {Store} from "@ngrx/store";
import * as fromApp from "../../../store/app.reducer";
import {selectMedia} from "../../store/posts.actions";

@Component({
    selector: 'app-post-items',
    templateUrl: './post-items.component.html',
    styleUrls: ['./post-items.component.css']
})
export class PostItemsComponent implements OnInit {
    @Input() post!: Post;

    sortedMedia!: Media[];

    constructor(private store: Store<fromApp.AppState>) {
    }

    ngOnInit(): void {
        this.sortedMedia = MediaUtils.sortByPriority([...this.post.mediaSet]);
    }

    onLoadMediaRequest(media: Media): void {
        this.store.dispatch(selectMedia({
            media: media
        }));
    }

    // TODO Implement
    onEditPost(): void {
        alert("Not implemented yet.");
    }
}
