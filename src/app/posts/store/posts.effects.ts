import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, map, switchMap} from 'rxjs/operators';
import {GET_POST, GET_POSTS_BY_QUERY, RESPONSE_TYPE} from '../../shared/config/api.constants';
import {of} from 'rxjs';
import {failSearch, getPostFail, getPostStart, getPostSuccess, startSearch, successSearch,} from './posts.actions';
import {Post} from '../../shared/model/post.model';
import {Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import {HypermediaResultList} from "../../shared/model/hypermedia-result-list.model";

@Injectable()
export class PostsEffects {

    searchStart = createEffect(() => this.actions$.pipe(
        ofType(startSearch),
        switchMap((state) => {
            return this.httpClient.get<HypermediaResultList<Post>>(
                GET_POSTS_BY_QUERY.replace(":userId", state.userId), {
                    headers: new HttpHeaders()
                        .append("Accept", RESPONSE_TYPE),
                    params: new HttpParams()
                        .append('page', state.page.toString())
                        .append('sortBy', state.sortBy)
                        .append('order', state.order)
                        .append('size', state.size.toString())
                        .append('query', state.query)
                }).pipe(
                map(response => {
                    let posts: Post[] = [];

                    console.log();

                    if (!!response._embedded) {
                        posts = response._embedded.postSnapshotList;
                    }

                    return successSearch({
                        posts: posts,
                        pageInfo: response.page!
                    });
                }),
                catchError(error => {
                    switch (error.status) {
                        default:
                            return of(failSearch({
                                searchErrorMessage: 'Something went wrong. Try again later.'
                            }));
                    }
                })
            );
        })
    ));

    getPostStart = createEffect(() => this.actions$.pipe(
        ofType(getPostStart),
        switchMap((state) => {
            return this.httpClient.get<Post>(
                GET_POST
                    .replace(":userId", state.userId)
                    .replace(":postId", state.postId), {
                    headers: new HttpHeaders()
                        .append("Accept", RESPONSE_TYPE)
                }).pipe(
                map(post => {
                    return getPostSuccess({
                        post: post
                    });
                }),
                catchError(error => {
                    switch (error.status) {
                        default:
                            return of(getPostFail({
                                postFetchErrorMessage: 'Something went wrong. Try again later.'
                            }));
                    }
                })
            );
        })
    ));

    constructor(
        private store: Store<fromApp.AppState>,
        private actions$: Actions,
        private httpClient: HttpClient
    ) {
    }
}
