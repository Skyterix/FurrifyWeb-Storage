import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, map, switchMap} from 'rxjs/operators';
import {GET_POST, GET_POSTS_BY_QUERY, GET_TAG, RESPONSE_TYPE} from '../../shared/config/api.constants';
import {of} from 'rxjs';
import {
    addTagToSelectedSetFail,
    addTagToSelectedSetStart,
    addTagToSelectedSetSuccess,
    failSearch,
    getPostFail,
    getPostStart,
    getPostSuccess,
    startSearch,
    successSearch,
} from './posts.actions';
import {Post} from '../../shared/model/post.model';
import {Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import {HypermediaResultList} from "../../shared/model/hypermedia-result-list.model";
import {Tag} from "../../shared/model/tag.model";
import {TagWrapper} from "./posts.reducer";

@Injectable()
export class PostsEffects {

    searchStart = createEffect(() => this.actions$.pipe(
        ofType(startSearch),
        switchMap((action) => {
            return this.httpClient.get<HypermediaResultList<Post>>(
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
                    let posts: Post[] = [];

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
        switchMap((action) => {
            return this.httpClient.get<Post>(
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
                        default:
                            return of(getPostFail({
                                postFetchErrorMessage: 'Something went wrong. Try again later.'
                            }));
                    }
                })
            );
        })
    ));

    selectedTagsAddStart = createEffect(() => this.actions$.pipe(
        ofType(addTagToSelectedSetStart),
        switchMap((action) => {
            return this.httpClient.get<Tag>(
                GET_TAG
                    .replace(":userId", action.userId)
                    .replace(":value", action.value)).pipe(
                map(response => {

                    let tagWrapper =
                        new TagWrapper(response, true);

                    return addTagToSelectedSetSuccess({
                        tagWrapper: tagWrapper
                    });
                }),
                catchError(error => {
                    switch (error.status) {
                        case 404:
                            const tag = {
                                title: "",
                                description: "",
                                ownerId: "",
                                type: "",
                                value: action.value,
                                createDate: new Date()
                            };

                            return of(addTagToSelectedSetSuccess({
                                tagWrapper: new TagWrapper(tag, false)
                            }));

                        default:
                            return of(addTagToSelectedSetFail({
                                value: action.value,
                                errorMessage: 'Something went wrong. Try again later.'
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
