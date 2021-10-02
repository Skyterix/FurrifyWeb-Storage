import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Media} from "../../../shared/model/media.model";
import {MediaUtils} from "../../../shared/util/media.utils";
import {Post} from "../../../shared/model/post.model";
import {Store} from "@ngrx/store";
import * as fromApp from "../../../store/app.reducer";
import {selectMedia} from "../../store/posts.actions";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-post-items',
    templateUrl: './post-items.component.html',
    styleUrls: ['./post-items.component.css']
})
export class PostItemsComponent implements OnInit, OnDestroy {
    @Input() post!: Post;

    sortedMedia!: Media[];

    selectedMedia!: Media | null;

    private storeSubscription!: Subscription;

    constructor(private store: Store<fromApp.AppState>) {
    }

    ngOnInit(): void {
        this.storeSubscription = this.store.select('posts').subscribe(state => {
            this.selectedMedia = state.selectedMedia;
        });

        this.sortedMedia = MediaUtils.sortByPriority([...this.post.mediaSet]);
    }

    ngOnDestroy(): void {
        this.storeSubscription.unsubscribe();
    }

    onLoadMediaRequest(media: Media): void {
        if (media == this.selectedMedia) {
            return;
        }

        this.store.dispatch(selectMedia({
            media: media
        }));
    }

    // TODO Implement
    onEditPost(): void {
        alert("Not implemented yet.");
    }
}
