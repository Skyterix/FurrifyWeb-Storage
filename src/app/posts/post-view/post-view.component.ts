import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Store} from "@ngrx/store";
import * as fromApp from "../../store/app.reducer";
import {Post} from "../../shared/model/post.model";
import {getPostStart} from "../store/posts.actions";
import {KeycloakProfile} from "keycloak-js";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-post-view',
    templateUrl: './post-view.component.html',
    styleUrls: ['./post-view.component.css']
})
export class PostViewComponent implements OnInit, OnDestroy {

    isFetching!: boolean;
    selectedPost!: Post | null;
    currentUser!: KeycloakProfile | null;

    private storeSubscription!: Subscription;

    constructor(private activatedRoute: ActivatedRoute,
                private store: Store<fromApp.AppState>) {
    }

    ngOnInit(): void {
        this.storeSubscription = this.store.select('posts').subscribe(state => {
            this.isFetching = state.isFetching;
            this.selectedPost = state.selectedPost;
        });
        this.storeSubscription = this.store.select('authentication').subscribe(state => {
            this.currentUser = state.currentUser;
        });

        // Wait to selectedPost be transferred from list
        setTimeout(() => this.loadPost());
    }


    ngOnDestroy(): void {
        this.storeSubscription.unsubscribe();
    }

    loadPost(): void {
        // If post already selected
        if (this.selectedPost != null) {
            return;
        }

        const postId = this.activatedRoute.snapshot.params.postId;

        this.store.dispatch(getPostStart({
            postId: postId,
            userId: this.currentUser?.id!
        }));
    }

}
