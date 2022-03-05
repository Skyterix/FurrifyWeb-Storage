import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, map, retryWhen, switchMap, tap} from 'rxjs/operators';
import {
    CREATE_ARTIST,
    CREATE_ATTACHMENT,
    CREATE_ATTACHMENT_SOURCE,
    CREATE_AVATAR,
    CREATE_MEDIA,
    CREATE_MEDIA_SOURCE,
    CREATE_POST,
    CREATE_TAG,
    GET_ARTIST,
    GET_ARTISTS_BY_PREFERRED_NICKNAME,
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
    addAttachment,
    addMedia,
    addTagToSelectedSetFail,
    addTagToSelectedSetStart,
    addTagToSelectedSetSuccess,
    createArtistFail,
    createArtistStart,
    createArtistUploadAvatarStart,
    createAttachmentsSourcesStart,
    createAttachmentsSourcesSuccess,
    createAttachmentsStart,
    createAttachmentsSuccess,
    createMediaSetSourcesStart,
    createMediaSetSourcesSuccess,
    createMediaSetStart,
    createMediaSetSuccess,
    createPostFail,
    createPostStart,
    createPostSuccess,
    createTagFail,
    createTagStart,
    failSearch,
    fetchArtistAfterCreationFail,
    fetchArtistAfterCreationStart,
    fetchArtistAfterCreationSuccess,
    fetchTagAfterCreationFail,
    fetchTagAfterCreationStart,
    fetchTagAfterCreationSuccess,
    getPostFail,
    getPostStart,
    getPostSuccess,
    startSearch,
    successSearch,
} from './posts.actions';
import {Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import {HypermediaResultList} from "../../shared/model/hypermedia-result-list.model";
import {Tag} from "../../shared/model/tag.model";
import {ArtistWrapper, TagWrapper} from "./posts.reducer";
import {RETRY_HANDLER} from "../../shared/store/shared.effects";
import {PostCreateService} from "../post-create/post-create.service";
import {Artist} from "../../shared/model/artist.model";
import {PostsService} from "../posts.service";
import {QueryPost} from "../../shared/model/query/query-post.model";
import {CreateAvatar} from "../../shared/model/request/create-avatar.model";
import {EXTENSION_EXTRACT_REGEX} from "../../shared/config/common.constats";
import {PostCreateStatusEnum} from "../../shared/enum/post-create-status.enum";
import {AvatarExtensionsConfig} from "../../shared/config/avatar-extensions.config";

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
                        case 503:
                            return of(addTagToSelectedSetFail({
                                value: action.value,
                                errorMessage: 'No servers available to handle your request. Try again later.'
                            }));
                        case 400:
                            return of(addTagToSelectedSetFail({
                                value: action.value,
                                errorMessage: error.error.message + ' If you think this is a bug, please contact the administrator.'
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
                        case 503:
                            return of(createTagFail({
                                errorMessage: 'No servers available to handle your request. Try again later.'
                            }));
                        case 400:
                            return of(createTagFail({
                                errorMessage: error.error.message + ' If you think this is a bug, please contact the administrator.'
                            }));
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
                        case 503:
                            errorMessage = 'No servers available to handle your request. Try again later.';
                            break;
                        case 404:
                            errorMessage = 'Tag creation was not handled yet by servers. Try again in a moment.';
                            break;
                        case 400:
                            errorMessage = error.error.message + ' If you think this is a bug, please contact the administrator.';
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
                GET_ARTISTS_BY_PREFERRED_NICKNAME
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
                            avatar: null,
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
                        case 503:
                            return of(addArtistToSelectedSetFail({
                                preferredNickname: action.preferredNickname,
                                errorMessage: 'No servers available to handle your request. Try again later.'
                            }));
                        case 400:
                            return of(addArtistToSelectedSetFail({
                                preferredNickname: action.preferredNickname,
                                errorMessage: error.error.message + ' If you think this is a bug, please contact the administrator.'
                            }));
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

    createArtistStart = createEffect(() => this.actions$.pipe(
        ofType(createArtistStart),
        switchMap((action) => {
            return this.httpClient.post(CREATE_ARTIST
                    .replace(":userId", action.userId),
                action.artist, {
                    observe: 'response'
                }).pipe(
                map(response => {
                    if (!action.avatar) {
                        return fetchArtistAfterCreationStart({
                            userId: action.userId,
                            artistId: response.headers.get('Id')!
                        });
                    }

                    return createArtistUploadAvatarStart({
                        userId: action.userId,
                        artistId: response.headers.get('Id')!,
                        avatar: action.avatar
                    });
                }),
                catchError(error => {
                    switch (error.status) {
                        case 503:
                            return of(createArtistFail({
                                errorMessage: 'No servers available to handle your request. Try again later.'
                            }));
                        case 400:
                            return of(createArtistFail({
                                errorMessage: error.error.message + ' If you think this is a bug, please contact the administrator.'
                            }));
                        default:
                            return of(createArtistFail({
                                errorMessage: 'Something went wrong. Try again later.'
                            }));
                    }
                })
            );
        })
    ));

    createArtistUploadAvatarStart = createEffect(() => this.actions$.pipe(
        ofType(createArtistUploadAvatarStart),
        switchMap((action) => {
            const data = new FormData();

            const avatarCreateCommand = new CreateAvatar(
                // Extract extension from filename and add prefix
                AvatarExtensionsConfig.PREFIX + EXTENSION_EXTRACT_REGEX.exec(action.avatar.name)![1].toUpperCase()
            );

            data.append("avatar", new Blob([JSON.stringify(avatarCreateCommand)], {
                type: "application/json"
            }));
            data.append("file", action.avatar, action.avatar.name);

            return this.httpClient.post(CREATE_AVATAR
                    .replace(":userId", action.userId)
                    .replace(":artistId", action.artistId),
                data).pipe(
                map(response => {
                    return fetchArtistAfterCreationStart({
                        userId: action.userId,
                        artistId: action.artistId
                    });
                }),
                retryWhen(RETRY_HANDLER),
                catchError(error => {
                    switch (error.status) {
                        case 503:
                            return of(createArtistFail({
                                errorMessage: 'No servers available to handle your request. Try again later.'
                            }));
                        case 400:
                            return of(createArtistFail({
                                errorMessage: error.error.message + ' If you think this is a bug, please contact the administrator.'
                            }));
                        default:
                            return of(createArtistFail({
                                errorMessage: 'Something went wrong while uploading "' +
                                    action.avatar.name +
                                    '" file. The artist was created.'
                            }));
                    }
                })
            );
        })
    ));

    fetchArtistAfterCreationStart = createEffect(() => this.actions$.pipe(
        ofType(fetchArtistAfterCreationStart),
        switchMap((action) => {
            return this.httpClient.get<Artist>(GET_ARTIST
                .replace(":userId", action.userId)
                .replace(":artistId", action.artistId),
            ).pipe(
                map(artist => {
                    return fetchArtistAfterCreationSuccess({
                        artist: artist
                    });
                }),
                retryWhen(RETRY_HANDLER),
                catchError(error => {
                    let errorMessage;

                    switch (error.status) {
                        case 503:
                            errorMessage = 'No servers available to handle your request. Try again later.'
                            break;
                        case 400:
                            errorMessage = error.error.message + ' If you think this is a bug, please contact the administrator.';
                            break;
                        case 404:
                            errorMessage = 'Artist creation was not handled yet by servers. Try again in a moment.';
                            break;
                        default:
                            errorMessage = 'Something went wrong. Try again later.';
                            break;
                    }

                    return of(fetchArtistAfterCreationFail({
                        errorMessage: errorMessage
                    }));
                })
                );
            }
        )
    ));

    createPostStart = createEffect(() => this.actions$.pipe(
        ofType(createPostStart),
        switchMap((action) => {
            return this.httpClient.post(CREATE_POST
                    .replace(":userId", action.userId),
                action.createPost, {
                    observe: 'response'
                }).pipe(
                map(response => {
                    return createPostSuccess({
                        postId: response.headers.get("Id")!
                    });
                }),
                catchError(error => {
                    switch (error.status) {
                        case 503:
                            return of(createPostFail({
                                errorMessage: 'No servers available to handle your request. Try again later.'
                            }));
                        case 400:
                            return of(createPostFail({
                                errorMessage: error.error.message + ' If you think this is a bug, please contact the administrator.'
                            }));
                        default:
                            return of(createPostFail({
                                errorMessage: 'Something went wrong. Try again later.'
                            }));
                    }
                })
            );
        })
    ));

    createPostSuccess = createEffect(() => this.actions$.pipe(
        ofType(createPostSuccess),
        tap(() => {
            this.postCreateService.postCreateStatusChangeEvent.emit(PostCreateStatusEnum.POST_CREATED);
        })
    ), {dispatch: false});

    createMediaSetStart = createEffect(() => this.actions$.pipe(
        ofType(createMediaSetStart),
        switchMap((action) => {
            const data = new FormData();

            const mediaSet = [...action.mediaSet];
            const mediaWrapper = {...mediaSet[action.currentIndex]};
            const media = {...mediaWrapper.media};

            // Overwrite priority based on index given by user
            media.priority = mediaSet.length - action.currentIndex - 1;

            data.append("media", new Blob([JSON.stringify(media)], {
                type: "application/json"
            }));
            data.append("file", mediaWrapper.mediaFile, mediaWrapper.mediaFile.name);
            // If thumbnail is present
            if (!!mediaWrapper.thumbnailFile) {
                data.append("thumbnail", mediaWrapper.thumbnailFile, mediaWrapper.thumbnailFile.name);
            }

            return this.httpClient.post(CREATE_MEDIA
                    .replace(":userId", action.userId)
                    .replace(":postId", action.postId),
                data, {observe: 'response'}).pipe(
                map(response => {
                    // Set uploaded media id and replace it in set
                    mediaWrapper.mediaId = response.headers.get("Id")!;
                    mediaSet[action.currentIndex] = mediaWrapper;

                    // If all media are uploaded
                    if (action.currentIndex == action.mediaSet.length - 1) {
                        return createMediaSetSuccess({
                            mediaSet: mediaSet
                        });
                    }

                    return createMediaSetStart({
                        userId: action.userId,
                        postId: action.postId,
                        currentIndex: action.currentIndex + 1,
                        mediaSet
                    });
                }),
                retryWhen(RETRY_HANDLER),
                catchError(error => {
                    switch (error.status) {
                        case 503:
                            return of(createPostFail({
                                errorMessage: 'No servers available to handle your request. Try again later.'
                            }));
                        case 400:
                            return of(createPostFail({
                                errorMessage: error.error.message + ' If you think this is a bug, please contact the administrator.'
                            }));
                        default:
                            return of(createPostFail({
                                errorMessage: 'Something went wrong while uploading "' +
                                    action.mediaSet[action.currentIndex].mediaFile.name +
                                    '" file. The upload of other files has been canceled.'
                            }));
                    }
                })
            );
        })
    ));

    createMediaSetSuccess = createEffect(() => this.actions$.pipe(
        ofType(createMediaSetSuccess),
        tap(() => {
            this.postCreateService.postCreateStatusChangeEvent.emit(PostCreateStatusEnum.MEDIA_SET_UPLOADED);
        })
    ), {dispatch: false});

    createAttachmentsStart = createEffect(() => this.actions$.pipe(
        ofType(createAttachmentsStart),
        switchMap((action) => {
            // If no attachments to upload
            if (action.attachments.length === 0) {
                return of(createAttachmentsSuccess());
            }

            const data = new FormData();
            const attachments = [...action.attachments];
            const attachmentWrapper = {...attachments[action.currentIndex]};

            data.append("attachment", new Blob([JSON.stringify(attachmentWrapper.attachment)], {
                type: "application/json"
            }));
            data.append("file", attachmentWrapper.file, attachmentWrapper.file.name);

            return this.httpClient.post(CREATE_ATTACHMENT
                    .replace(":userId", action.userId)
                    .replace(":postId", action.postId),
                data, {observe: 'response'}).pipe(
                map(response => {
                    // Set uploaded media id and replace it in set
                    attachmentWrapper.attachmentId = response.headers.get("Id")!;
                    attachments[action.currentIndex] = attachmentWrapper;

                    // If all attachments are uploaded
                    if (action.currentIndex == action.attachments.length - 1) {
                        return createAttachmentsSuccess();
                    }

                    return createAttachmentsStart({
                        userId: action.userId,
                        postId: action.postId,
                        currentIndex: action.currentIndex + 1,
                        attachments
                    });
                }),
                retryWhen(RETRY_HANDLER),
                catchError(error => {
                    switch (error.status) {
                        case 503:
                            return of(createPostFail({
                                errorMessage: 'No servers available to handle your request. Try again later.'
                            }));
                        case 400:
                            return of(createPostFail({
                                errorMessage: error.error.message + ' If you think this is a bug, please contact the administrator.'
                            }));
                        default:
                            return of(createPostFail({
                                errorMessage: 'Something went wrong while uploading "' +
                                    action.attachments[action.currentIndex].file.name +
                                    '" file. The upload of other files has been canceled.'
                            }));
                    }
                })
            );
        })
    ));

    createAttachmentsSuccess = createEffect(() => this.actions$.pipe(
        ofType(createAttachmentsSuccess),
        tap(() => {
            this.postCreateService.postCreateStatusChangeEvent.emit(PostCreateStatusEnum.ATTACHMENTS_UPLOADED);
        })
    ), {dispatch: false});

    createMediaSetSourcesStart = createEffect(() => this.actions$.pipe(
        ofType(createMediaSetSourcesStart),
        switchMap((action) => {
            const media = action.mediaSet[action.currentMediaIndex];

            // If no sources in media and it's last media in set
            if (media.sources.length === 0) {
                if (action.currentMediaIndex === action.mediaSet.length - 1) {
                    return of(createMediaSetSourcesSuccess());
                } else {
                    return of(createMediaSetSourcesStart(
                        {
                            userId: action.userId,
                            postId: action.postId,
                            mediaSet: action.mediaSet,
                            currentMediaIndex: action.currentMediaIndex + 1,
                            currentSourceIndex: 0
                        }
                    ));
                }
            }

            const mediaWrapper = action.mediaSet[action.currentMediaIndex];
            const source = mediaWrapper.sources[action.currentSourceIndex];

            return this.httpClient.post(CREATE_MEDIA_SOURCE
                    .replace(":userId", action.userId)
                    .replace(":postId", action.postId)
                    .replace(":mediaId", mediaWrapper.mediaId),
                source).pipe(
                map(response => {
                    // If all sources created
                    if (action.currentSourceIndex === media.sources.length - 1) {
                        // If all media cycled through
                        if (action.currentMediaIndex === action.mediaSet.length - 1) {
                            return createMediaSetSourcesSuccess();
                        } else {
                            return createMediaSetSourcesStart(
                                {
                                    userId: action.userId,
                                    postId: action.postId,
                                    mediaSet: action.mediaSet,
                                    currentMediaIndex: action.currentMediaIndex + 1,
                                    currentSourceIndex: 0
                                }
                            );
                        }
                    }

                    return createMediaSetSourcesStart(
                        {
                            userId: action.userId,
                            postId: action.postId,
                            mediaSet: action.mediaSet,
                            currentMediaIndex: action.currentMediaIndex,
                            currentSourceIndex: action.currentSourceIndex + 1
                        }
                    );
                }),
                retryWhen(RETRY_HANDLER),
                catchError(error => {
                    switch (error.status) {
                        case 503:
                            return of(createPostFail({
                                errorMessage: 'No servers available to handle your request. Try again later.'
                            }));
                        case 400:
                            return of(createPostFail({
                                errorMessage: error.error.message + ' If you think this is a bug, please contact the administrator.'
                            }));
                        default:
                            return of(createPostFail({
                                errorMessage: 'Something went wrong while creating source for "' +
                                    action.mediaSet[action.currentMediaIndex].mediaFile.name +
                                    '" file. The creation of other sources has been cancelled.'
                            }));
                    }
                })
            );
        })
    ));

    createMediaSetSourcesSuccess = createEffect(() => this.actions$.pipe(
        ofType(createMediaSetSourcesSuccess),
        tap(() => {
            this.postCreateService.postCreateStatusChangeEvent.emit(PostCreateStatusEnum.MEDIA_SET_SOURCES_CREATED);
        })
    ), {dispatch: false});

    createAttachmentsSourcesStart = createEffect(() => this.actions$.pipe(
        ofType(createAttachmentsSourcesStart),
        switchMap((action) => {
            // If no attachments created
            if (action.attachments.length === 0) {
                return of(createAttachmentsSourcesSuccess());
            }

            const attachment = action.attachments[action.currentAttachmentIndex];

            // If no sources in attachment and it's last attachment in set
            if (attachment.sources.length === 0) {
                if (action.currentAttachmentIndex === action.attachments.length - 1) {
                    return of(createAttachmentsSourcesSuccess());
                } else {
                    return of(createAttachmentsSourcesStart(
                        {
                            userId: action.userId,
                            postId: action.postId,
                            attachments: action.attachments,
                            currentAttachmentIndex: action.currentAttachmentIndex + 1,
                            currentSourceIndex: 0
                        }
                    ));
                }
            }

            const attachmentWrapper = action.attachments[action.currentAttachmentIndex];
            const source = attachmentWrapper.sources[action.currentSourceIndex];

            return this.httpClient.post(CREATE_ATTACHMENT_SOURCE
                    .replace(":userId", action.userId)
                    .replace(":postId", action.postId)
                    .replace(":attachmentId", attachmentWrapper.attachmentId),
                source).pipe(
                map(response => {
                    // If all sources created
                    if (action.currentSourceIndex === attachment.sources.length - 1) {
                        // If all attachment cycled through
                        if (action.currentAttachmentIndex === action.attachments.length - 1) {
                            return createAttachmentsSourcesSuccess();
                        } else {
                            return createAttachmentsSourcesStart(
                                {
                                    userId: action.userId,
                                    postId: action.postId,
                                    attachments: action.attachments,
                                    currentAttachmentIndex: action.currentAttachmentIndex + 1,
                                    currentSourceIndex: 0
                                }
                            );
                        }
                    }

                    return createAttachmentsSourcesStart(
                        {
                            userId: action.userId,
                            postId: action.postId,
                            attachments: action.attachments,
                            currentAttachmentIndex: action.currentAttachmentIndex,
                            currentSourceIndex: action.currentSourceIndex + 1
                        }
                    );
                }),
                retryWhen(RETRY_HANDLER),
                catchError(error => {
                    switch (error.status) {
                        case 503:
                            return of(createPostFail({
                                errorMessage: 'No servers available to handle your request. Try again later.'
                            }));
                        case 400:
                            return of(createPostFail({
                                errorMessage: error.error.message + ' If you think this is a bug, please contact the administrator.'
                            }));
                        default:
                            return of(createPostFail({
                                errorMessage: 'Something went wrong while creating source for "' +
                                    action.attachments[action.currentAttachmentIndex].file.name +
                                    '" file. The creation of other sources has been cancelled.'
                            }));
                    }
                })
            );
        })
    ));

    createAttachmentsSourcesSuccess = createEffect(() => this.actions$.pipe(
        ofType(createAttachmentsSourcesSuccess),
        tap(() => {
            this.postCreateService.postCreateStatusChangeEvent.emit(PostCreateStatusEnum.ATTACHMENTS_SOURCES_CREATED);
            setTimeout(() => {
                this.postCreateService.postCreateCloseEvent.emit();
                this.postsService.triggerSearch()
            }, 50)
        })
    ), {dispatch: false});


    artistFetchSuccess = createEffect(() => this.actions$.pipe(
        ofType(fetchArtistAfterCreationSuccess),
        tap(() => {
            this.postCreateService.artistCreateCloseEvent.emit();
        })
    ), {dispatch: false});

    addMedia = createEffect(() => this.actions$.pipe(
        ofType(addMedia),
        tap(() => {
            this.postCreateService.mediaCreateCloseEvent.emit();
        })
    ), {dispatch: false});

    addAttachment = createEffect(() => this.actions$.pipe(
        ofType(addAttachment),
        tap(() => {
            this.postCreateService.attachmentCreateCloseEvent.emit();
        })
    ), {dispatch: false});


    constructor(
        private store: Store<fromApp.AppState>,
        private actions$: Actions,
        private httpClient: HttpClient,
        private postCreateService: PostCreateService,
        private postsService: PostsService
    ) {
    }
}
