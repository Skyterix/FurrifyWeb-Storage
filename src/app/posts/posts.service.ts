import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import * as fromApp from '../store/app.reducer';
import {getPostStart, startSearch, updateSearchParams, updateSearchQuery} from "./store/posts.actions";
import {KeycloakProfile} from "keycloak-js";
import {MAX_SIZE} from "../shared/config/limit.constants";

@Injectable({
    providedIn: 'root'
})
export class PostsService {

    query!: string;
    sortBy!: string;
    size!: number;
    order!: string;
    page!: number;

    currentUser!: KeycloakProfile | null;

    constructor(private store: Store<fromApp.AppState>, private activatedRoute: ActivatedRoute, private router: Router) {
        this.store.select('authentication').subscribe(state => {
            this.currentUser = state.currentUser;
        });

        this.store.select('posts').subscribe(state => {
            this.query = state.query;
            this.sortBy = state.sortBy;
            this.size = state.size;
            this.order = state.order;
            this.page = state.page;
        });

        this.activatedRoute.queryParams.subscribe(params => {
            this.updateSearchQuery(params.query);
            this.updateSearchParams(params.sortBy, params.order, params.size, params.page);
        });
    }

    triggerSearch(): void {
        this.store.dispatch(startSearch(
            {
                query: this.query,
                sortBy: this.sortBy,
                order: this.order,
                size: this.size,
                page: this.page,
                userId: this.currentUser!.id!
            }
        ));

        this.router.navigate(['/posts']);
    }

    private updateSearchQuery(query: string): void {
        query = (!!query ? query : '');

        this.store.dispatch(updateSearchQuery({
            query: query
        }));
    }

    private updateSearchParams(sortBy: string,
                               order: string,
                               size: number,
                               page: number): void {
        // Check if values are empty and if so use old values (default if never changed)
        sortBy = (!!sortBy) ? sortBy : this.sortBy;
        order = (!!order) ? order : this.order;
        size = (!!size) ? size : this.size;
        page = (!!page) ? page : this.page;

        // Check limits

        if (size > MAX_SIZE) {
            this.router.navigate([], {
                queryParams: {
                    size: MAX_SIZE
                },
                queryParamsHandling: "merge"
            });
        }

        if (size <= 0) {
            this.router.navigate([], {
                queryParams: {
                    size: 1
                },
                queryParamsHandling: "merge"
            });
        }

        if (page <= 0) {
            this.router.navigate([], {
                queryParams: {
                    page: 1
                },
                queryParamsHandling: "merge"
            });
        }

        this.store.dispatch(updateSearchParams({
            sortBy,
            order,
            size,
            page
        }));
    }

    loadPost(userId: string, postId: string): void {
        this.store.dispatch(getPostStart({
            userId: this.currentUser?.id!,
            postId: postId
        }));
    }
}
