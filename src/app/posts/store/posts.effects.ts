import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {
    DELETE_POST,
    GET_POST,
    GET_POST_MEDIA_SOURCES,
    GET_POSTS_BY_QUERY,
    RESPONSE_TYPE
} from '../../shared/config/api.constants';
import {of} from 'rxjs';
import {
    deletePostFail,
    deletePostStart,
    deletePostSuccess,
    failSearch,
    getPostFail,
    getPostMediaSourcesFail,
    getPostMediaSourcesStart,
    getPostMediaSourcesSuccess,
    getPostStart,
    getPostSuccess,
    startSearch,
    successSearch,
} from './posts.actions';
import {Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import {HypermediaResultList} from "../../shared/model/hypermedia-result-list.model";
import {QueryPost} from "../../shared/model/query/query-post.model";
import {Router} from "@angular/router";
import {QuerySource} from "../../shared/model/query/query-source.model";

@Injectable()
export class PostsEffects {

    searchStart = createEffect(() => this.actions$.pipe(
        ofType(startSearch),
        switchMap((action) => {
            return this.httpClient.get<HypermediaResultList<QueryPost>>(
                GET_POSTS_BY_QUERY.replace(":userId", action.userId), {
                    headers: new HttpHeaders()
                        .append("Accept", RESPONSE_TYPE),
                    params: new HttpParams()
                        .append('page', action.page.toString())
                        .append('sortBy', action.sortBy)
                        .append('order', action.order)
                        .append('size', action.size.toString())
                        .append('query', action.query)
                }).pipe(
                map(response => {
                    let posts: QueryPost[] = [];

                    if (!!response._embedded) {
                        posts = response._embedded.List;
                    }

                    return successSearch({
                        posts: posts,
                        pageInfo: response.page!
                    });
                }),
                catchError(error => {
                    switch (error.status) {
                        case 503:
                            return of(failSearch({
                                searchErrorMessage: 'No servers available to handle your request. Try again later.'
                            }));
                        case 400:
                            return of(failSearch({
                                searchErrorMessage: error.error.message + ' If you think this is a bug, please contact the administrator.'
                            }));
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
        switchMap((action) => {
            return this.httpClient.get<QueryPost>(
                GET_POST
                    .replace(":userId", action.userId)
                    .replace(":postId", action.postId), {
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
                        case 503:
                            return of(getPostFail({
                                postFetchErrorMessage: 'No servers available to handle your request. Try again later.'
                            }));
                        case 404:
                            return of(getPostFail({
                                postFetchErrorMessage: 'Post does not exists.'
                            }));
                        case 400:
                            return of(getPostFail({
                                postFetchErrorMessage: error.error.message + ' If you think this is a bug, please contact the administrator.'
                            }));
                        default:
                            return of(getPostFail({
                                postFetchErrorMessage: 'Something went wrong. Try again later.'
                            }));
                    }
                })
            );
        })
    ));


    getPostMediaSourcesStart = createEffect(() => this.actions$.pipe(
        ofType(getPostMediaSourcesStart),
        switchMap((action) => {
            return this.httpClient.get<HypermediaResultList<QuerySource>>(
                GET_POST_MEDIA_SOURCES
                    .replace(":userId", action.userId)
                    .replace(":postId", action.postId)
                    .replace(":mediaId", action.mediaId), {
                    params: new HttpParams()
                        // TODO probably needs pagination
                        .append("size", 100),
                    headers: new HttpHeaders()
                        .append("Accept", RESPONSE_TYPE)
                }).pipe(
                map(sources => {
                    return getPostMediaSourcesSuccess({
                        sources: sources._embedded.sourceSnapshotList
                    });
                }),
                catchError(error => {
                    switch (error.status) {
                        case 503:
                            return of(getPostMediaSourcesFail({
                                errorMessage: 'No servers available to handle your request. Try again later.'
                            }));
                        case 404:
                            return of(getPostMediaSourcesFail({
                                errorMessage: 'Post media does not exists.'
                            }));
                        case 400:
                            return of(getPostMediaSourcesFail({
                                errorMessage: error.error.message + ' If you think this is a bug, please contact the administrator.'
                            }));
                        default:
                            return of(getPostMediaSourcesFail({
                                errorMessage: 'Something went wrong. Try again later.'
                            }));
                    }
                })
            );
        })
    ));

    deletePostStart = createEffect(() => this.actions$.pipe(
        ofType(deletePostStart),
        switchMap((action) => {
            return this.httpClient.delete(DELETE_POST
                .replace(":userId", action.userId)
                .replace(":postId", action.postId), {
                observe: 'response'
            }).pipe(
                map(response => {
                    return deletePostSuccess({
                        postId: action.postId
                    });
                }),
                catchError(error => {
                    switch (error.status) {
                        case 503:
                            return of(deletePostFail({
                                errorMessage: 'No servers available to handle your request. Try again later.'
                            }));
                        case 400:
                            return of(deletePostFail({
                                errorMessage: error.error.message + ' If you think this is a bug, please contact the administrator.'
                            }));
                        default:
                            return of(deletePostFail({
                                errorMessage: 'Something went wrong. Try again later.'
                            }));
                    }
                })
            );
        })
    ));

    deletePostSuccess = createEffect(() => this.actions$.pipe(
        ofType(deletePostSuccess),
        tap(() => {
            this.router.navigate(['/posts'], {queryParamsHandling: "merge"});
        })
    ), {dispatch: false});

    constructor(
        private store: Store<fromApp.AppState>,
        private router: Router,
        private actions$: Actions,
        private httpClient: HttpClient
    ) {
    }
}
