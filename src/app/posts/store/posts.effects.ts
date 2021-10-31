import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, map, retryWhen, switchMap, tap} from 'rxjs/operators';
import {
    CREATE_TAG,
    GET_ARTIST,
    GET_POST,
    GET_POSTS_BY_QUERY,
    GET_TAG,
    RESPONSE_TYPE
} from '../../shared/config/api.constants';
import {of} from 'rxjs';
import {
    addArtistToSelectedSetFail,
    addArtistToSelectedSetStart,
    addArtistToSelectedSetSuccess,
    addTagToSelectedSetFail,
    addTagToSelectedSetStart,
    addTagToSelectedSetSuccess,
    createTagFail,
    createTagStart,
    failSearch,
    fetchTagAfterCreationFail,
    fetchTagAfterCreationStart,
    fetchTagAfterCreationSuccess,
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
import {ArtistWrapper, TagWrapper} from "./posts.reducer";
import {RETRY_HANDLER} from "../../shared/store/shared.effects";
import {PostCreateService} from "../post-create/post-create.service";
import {Artist} from "../../shared/model/artist.model";

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

    createTagStart = createEffect(() => this.actions$.pipe(
        ofType(createTagStart),
        switchMap((action) => {
            return this.httpClient.post(CREATE_TAG
                    .replace(":userId", action.userId),
                action.tag, {
                    observe: 'response'
                }).pipe(
                map(response => {
                    return fetchTagAfterCreationStart({
                        userId: action.userId,
                        value: response.headers.get('Id')!
                    });
                }),
                catchError(error => {
                    switch (error.status) {
                        default:
                            return of(createTagFail({
                                errorMessage: 'Something went wrong. Try again later.'
                            }));
                    }
                })
            );
        })
    ));

    fetchTagAfterCreationStart = createEffect(() => this.actions$.pipe(
        ofType(fetchTagAfterCreationStart),
        switchMap((action) => {
            return this.httpClient.get<Tag>(GET_TAG
                .replace(":userId", action.userId)
                .replace(":value", action.value),
            ).pipe(
                map(tag => {
                    return fetchTagAfterCreationSuccess({
                        tag: tag
                    });
                }),
                retryWhen(RETRY_HANDLER),
                catchError(error => {
                    let errorMessage;

                    switch (error.status) {
                        case 404:
                            errorMessage = 'Tag creation was not handled yet by servers. Try again in a moment.';
                            break;
                        default:
                            errorMessage = 'Something went wrong. Try again later.';
                            break;
                    }

                    return of(fetchTagAfterCreationFail({
                        errorMessage: errorMessage
                    }));
                })
            );
        })
    ));

    tagFetchSuccess = createEffect(() => this.actions$.pipe(
        ofType(fetchTagAfterCreationSuccess),
        tap(() => {
            this.postCreateService.tagCreateCloseEvent.emit();
        })
    ), {dispatch: false});

    selectedArtistsAddStart = createEffect(() => this.actions$.pipe(
        ofType(addArtistToSelectedSetStart),
        switchMap((action) => {
            return this.httpClient.get<HypermediaResultList<Artist>>(
                GET_ARTIST
                    .replace(":userId", action.userId), {
                    params: {
                        preferredNickname: action.preferredNickname
                    },
                    headers: new HttpHeaders()
                        .append("Accept", RESPONSE_TYPE)
                }).pipe(
                map(response => {

                    // If returned list is empty
                    if (!response._embedded) {
                        const artist = {
                            artistId: '',
                            ownerId: '',
                            nicknames: [],
                            preferredNickname: action.preferredNickname,
                            sources: [],
                            createDate: new Date()
                        };

                        return addArtistToSelectedSetSuccess({
                            artistWrapper: new ArtistWrapper(artist, false)
                        });
                    }

                    let artistWrapper =
                        new ArtistWrapper(response._embedded.artistSnapshotList[0], true);

                    return addArtistToSelectedSetSuccess({
                        artistWrapper: artistWrapper
                    });
                }),
                catchError(error => {
                    switch (error.status) {
                        default:
                            return of(addArtistToSelectedSetFail({
                                preferredNickname: action.preferredNickname,
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
        private httpClient: HttpClient,
        private postCreateService: PostCreateService
    ) {
    }
}
