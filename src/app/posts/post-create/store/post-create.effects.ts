import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {
    addArtistSourceAfterCreationFail,
    addArtistSourceAfterCreationStart,
    addArtistSourceAfterCreationSuccess,
    addArtistToSelectedSetFail,
    addArtistToSelectedSetStart,
    addArtistToSelectedSetSuccess,
    addAttachment,
    addMedia,
    addTagToSelectedSetFail,
    addTagToSelectedSetStart,
    addTagToSelectedSetSuccess,
    createArtistFail,
    createArtistSourceFail,
    createArtistSourceStart,
    createArtistSourceSuccess,
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
    fetchArtistAfterCreationFail,
    fetchArtistAfterCreationStart,
    fetchArtistAfterCreationSuccess,
    fetchArtistSourcesFail,
    fetchArtistSourcesStart,
    fetchArtistSourcesSuccess,
    fetchAttachmentSourcesFail,
    fetchAttachmentSourcesStart,
    fetchAttachmentSourcesSuccess,
    fetchMediaSourcesFail,
    fetchMediaSourcesStart,
    fetchMediaSourcesSuccess,
    fetchTagAfterCreationFail,
    fetchTagAfterCreationStart,
    fetchTagAfterCreationSuccess,
    loadPostToEdit,
    removeArtistSourceFail,
    removeArtistSourceStart,
    removeArtistSourceSuccess,
    removeAttachmentFromPostFail,
    removeAttachmentFromPostStart,
    removeAttachmentFromPostSuccess,
    removeMediaFromPostFail,
    removeMediaFromPostStart,
    removeMediaFromPostSuccess,
    replaceMediaSetStart,
    replaceMediaSetSuccess,
    savePostFail,
    savePostStart,
    savePostSuccess
} from "./post-create.actions";
import {catchError, map, mergeMap, retryWhen, tap} from "rxjs/operators";
import {Tag} from "../../../shared/model/tag.model";
import {
    CREATE_ARTIST,
    CREATE_ARTIST_SOURCE,
    CREATE_ATTACHMENT,
    CREATE_ATTACHMENT_SOURCE,
    CREATE_AVATAR,
    CREATE_MEDIA,
    CREATE_MEDIA_SOURCE,
    CREATE_POST,
    CREATE_TAG,
    DELETE_ATTACHMENT,
    DELETE_MEDIA,
    DELETE_SOURCE,
    GET_ARTIST,
    GET_ARTIST_SOURCES,
    GET_ARTISTS_BY_PREFERRED_NICKNAME,
    GET_POST_ATTACHMENT_SOURCES,
    GET_POST_MEDIA_SOURCES,
    GET_SOURCE,
    GET_TAG,
    RESPONSE_TYPE,
    UPDATE_MEDIA,
    UPDATE_POST
} from "../../../shared/config/api.constants";
import {Observable, of} from "rxjs";
import {RETRY_HANDLER} from "../../../shared/store/shared.effects";
import {HypermediaResultList} from "../../../shared/model/hypermedia-result-list.model";
import {Artist} from "../../../shared/model/artist.model";
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
import {CreateAvatar} from "../../../shared/model/request/create-avatar.model";
import {AvatarExtensionsConfig} from "../../../shared/config/avatar-extensions.config";
import {EXTENSION_EXTRACT_REGEX} from "../../../shared/config/common.constats";
import {PostCreateStatusEnum} from "../../../shared/enum/post-create-status.enum";
import {PostCreateService} from "../post-create.service";
import {PostsService} from "../../posts.service";
import {Store} from "@ngrx/store";
import * as fromApp from "../../../store/app.reducer";
import {Router} from "@angular/router";
import {
    ArtistWrapper,
    AttachmentWrapper,
    MediaWrapper,
    TagWrapper,
    WrapperSourcesFetchingStatus,
    WrapperStatus
} from "./post-create.reducer";
import {QuerySource} from "../../../shared/model/query/query-source.model";
import {dummy} from "../../../shared/store/shared.actions";
import {PostSaveStatusEnum} from "../../../shared/enum/post-save-status.enum";

@Injectable()
export class PostCreateEffects {

    selectedTagsAddStart = createEffect(() => this.actions$.pipe(
        ofType(addTagToSelectedSetStart),
        mergeMap((action) => {
            return this.httpClient.get<Tag>(
                GET_TAG
                    .replace(":userId", action.userId)
                    .replace(":value", action.value)).pipe(
                map(response => {
                    let tagWrapper =
                        new TagWrapper(response, WrapperStatus.FOUND);

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
                                tagWrapper: new TagWrapper(tag, WrapperStatus.NOT_FOUND)
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
        mergeMap((action) => {
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
                        case 409:
                            return of(createTagFail({
                                errorMessage: 'Tag with that value already exists.'
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
        mergeMap((action) => {
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
            this.postCreateService.clearPostCreateSideStepModalEvent.emit();
        })
    ), {dispatch: false});

    selectedArtistsAddStart = createEffect(() => this.actions$.pipe(
        ofType(addArtistToSelectedSetStart),
        mergeMap((action) => {
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
                            artistWrapper: new ArtistWrapper(artist, [], WrapperStatus.NOT_FOUND, WrapperSourcesFetchingStatus.NOT_QUERIED)
                        });
                    }

                    let artistWrapper =
                        new ArtistWrapper(response._embedded.artistSnapshotList[0], [], WrapperStatus.FOUND, WrapperSourcesFetchingStatus.NOT_QUERIED);

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
        mergeMap((action) => {
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
                        case 409:
                            return of(createArtistFail({
                                errorMessage: 'Artist with this preferred nickname already exists.'
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
        mergeMap((action) => {
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
        mergeMap((action) => {
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
        mergeMap((action) => {
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
                        case 404:
                            return of(createPostFail({
                                errorMessage: error.error.message + ' If you think this is a bug, please contact the administrator.'
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

    createMediaSetStart = createEffect(() => this.actions$.pipe(
        ofType(createMediaSetStart),
        mergeMap((action) => {
            const data = new FormData();

            const mediaSet = [...action.mediaSet];
            const mediaWrapper: MediaWrapper = {...mediaSet[action.currentIndex]};
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
                        case 404:
                            return of(createPostFail({
                                errorMessage: error.error.message + ' If you think this is a bug, please contact the administrator.'
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
        mergeMap((action) => {
            // If no attachments to upload
            if (action.attachments.length === 0) {
                return of(createAttachmentsSuccess({
                    attachments: action.attachments
                }));
            }

            const data = new FormData();
            const attachments = [...action.attachments];
            const attachmentWrapper: AttachmentWrapper = {...attachments[action.currentIndex]};

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
                        return createAttachmentsSuccess({
                            attachments: attachments
                        });
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
                        case 404:
                            return of(createPostFail({
                                errorMessage: error.error.message + ' If you think this is a bug, please contact the administrator.'
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
        mergeMap((action) => {
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


            if (!mediaWrapper.mediaId) {
                throw new Error("Media uuid is empty!");
            }

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
                        case 404:
                            return of(createPostFail({
                                errorMessage: error.error.message + ' If you think this is a bug, please contact the administrator.'
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
        mergeMap((action) => {
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

            if (!attachmentWrapper.attachmentId) {
                throw new Error("Attachment uuid is empty!");
            }

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
                        case 404:
                            return of(createPostFail({
                                errorMessage: error.error.message + ' If you think this is a bug, please contact the administrator.'
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

    fetchArtistSourcesStart = createEffect(() => this.actions$.pipe(
        ofType(fetchArtistSourcesStart),
        mergeMap((action) => {
            return this.httpClient.get<HypermediaResultList<QuerySource>>(GET_ARTIST_SOURCES
                    .replace(":userId", action.userId)
                    .replace(":artistId", action.artistId), {
                    params: new HttpParams()
                        // TODO probably needs pagination
                        .append("size", 100),
                    headers: new HttpHeaders()
                        .append("Accept", RESPONSE_TYPE)
                },
            ).pipe(
                    map(sourcesResponse => {
                        let sources: QuerySource[] = [];

                        if (!!sourcesResponse._embedded) {
                            sources = sourcesResponse._embedded.sourceSnapshotList;
                        }

                        return fetchArtistSourcesSuccess({
                            artistId: action.artistId,
                            artistSources: sources
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
                                errorMessage = 'Artist was not found and sources could not be fetched. Try again in a moment.';
                                break;
                            default:
                                errorMessage = 'Something went wrong. Try again later.';
                                break;
                        }

                        return of(fetchArtistSourcesFail({
                            artistId: action.artistId,
                            errorMessage: errorMessage
                        }));
                    })
                );
            }
        )
    ));

    addArtistSourceAfterCreationStart = createEffect(() => this.actions$.pipe(
        ofType(addArtistSourceAfterCreationStart),
        mergeMap((action) => {
            return this.httpClient.get<QuerySource>(GET_SOURCE
                .replace(":userId", action.userId)
                .replace(":sourceId", action.sourceId)
            ).pipe(
                map(source => {

                    return addArtistSourceAfterCreationSuccess({
                        artistId: action.artistId,
                        source: source
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
                                errorMessage = 'Created artist source has not yet been processed. Try again in a moment.';
                                break;
                            default:
                                errorMessage = 'Something went wrong. Try again later.';
                                break;
                        }

                        return of(addArtistSourceAfterCreationFail({
                            artistId: action.artistId,
                            errorMessage: errorMessage
                        }));
                    })
                );
            }
        )
    ));

    addArtistToSelectedSetSuccess = createEffect(() => this.actions$.pipe(
        ofType(addArtistToSelectedSetSuccess),
        map((action) => {
            // If artist exists, fetch sources
            if (action.artistWrapper.status === WrapperStatus.FOUND) {
                return fetchArtistSourcesStart({
                    userId: action.artistWrapper.artist.ownerId,
                    artistId: action.artistWrapper.artist.artistId
                });
            }

            // Workaround for typescript weirdness
            return dummy();
        })
    ));

    createArtistSourceStart = createEffect(() => this.actions$.pipe(
        ofType(createArtistSourceStart),
        mergeMap((action) => {
            return this.httpClient.post(CREATE_ARTIST_SOURCE
                    .replace(":userId", action.userId)
                    .replace(":artistId", action.artistId),
                action.createSource, {
                    observe: 'response'
                }).pipe(
                map(response => {
                    return createArtistSourceSuccess({
                        userId: action.userId,
                        artistId: action.artistId,
                        sourceId: response.headers.get("Id")!
                    });
                }),
                catchError(error => {
                    switch (error.status) {
                        case 503:
                            return of(createArtistSourceFail({
                                errorMessage: 'No servers available to handle your request. Try again later.'
                            }));
                        case 404:
                            return of(createPostFail({
                                errorMessage: error.error.message + ' If you think this is a bug, please contact the administrator.'
                            }));
                        case 400:
                            return of(createArtistSourceFail({
                                errorMessage: error.error.message + ' If you think this is a bug, please contact the administrator.'
                            }));
                        default:
                            return of(createArtistSourceFail({
                                errorMessage: 'Something went wrong. Try again later.'
                            }));
                    }
                })
            );
        })
    ));

    removeArtistSourceStart = createEffect(() => this.actions$.pipe(
        ofType(removeArtistSourceStart),
        mergeMap((action) => {
            return this.httpClient.delete<HypermediaResultList<QuerySource>>(DELETE_SOURCE
                .replace(":userId", action.userId)
                .replace(":sourceId", action.sourceId)
            ).pipe(
                map(response => {
                    return removeArtistSourceSuccess({
                        artistId: action.artistId,
                        sourceId: action.sourceId
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
                                errorMessage = 'Artist source was not found and could not be deleted. Try again in a moment.';
                                break;
                            default:
                                errorMessage = 'Something went wrong. Try again later.';
                                break;
                        }

                        return of(removeArtistSourceFail({
                            artistId: action.artistId,
                            sourceId: action.sourceId,
                            errorMessage
                        }));
                    })
            );
            }
        )
    ));

    savePostStart = createEffect(() => this.actions$.pipe(
        ofType(savePostStart),
        mergeMap((action) => {
            return this.httpClient.patch(UPDATE_POST
                    .replace(":userId", action.userId)
                    .replace(":postId", action.postId),
                action.savePost, {
                    observe: 'response'
                }).pipe(
                map(response => {
                    return savePostSuccess();
                }),
                catchError(error => {
                    switch (error.status) {
                        case 503:
                            return of(savePostFail({
                                errorMessage: 'No servers available to handle your request. Try again later.'
                            }));
                        case 404:
                            return of(savePostFail({
                                errorMessage: error.error.message + ' If you think this is a bug, please contact the administrator.'
                            }));
                        case 400:
                            return of(savePostFail({
                                errorMessage: error.error.message + ' If you think this is a bug, please contact the administrator.'
                            }));
                        default:
                            return of(savePostFail({
                                errorMessage: 'Something went wrong. Try again later.'
                            }));
                    }
                })
            );
        })
    ));

    fetchMediaSourcesStart = createEffect(() => this.actions$.pipe(
        ofType(fetchMediaSourcesStart),
        mergeMap((action) => {
                return this.httpClient.get<HypermediaResultList<QuerySource>>(GET_POST_MEDIA_SOURCES
                        .replace(":userId", action.userId)
                        .replace(":postId", action.postId)
                        .replace(":mediaId", action.mediaId), {
                        params: new HttpParams()
                            // TODO probably needs pagination
                            .append("size", 100),
                        headers: new HttpHeaders()
                            .append("Accept", RESPONSE_TYPE)
                    },
                ).pipe(
                    map(sourcesResponse => {
                        let sources: QuerySource[] = [];

                        if (!!sourcesResponse._embedded) {
                            sources = sourcesResponse._embedded.sourceSnapshotList;
                        }

                        return fetchMediaSourcesSuccess({
                            mediaId: action.mediaId,
                            mediaSources: sources
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
                                errorMessage = 'Media was not found and sources could not be fetched. Try again in a moment.';
                                break;
                            default:
                                errorMessage = 'Something went wrong. Try again later.';
                                break;
                        }

                        return of(fetchMediaSourcesFail({
                            mediaId: action.mediaId,
                            errorMessage: errorMessage
                        }));
                    })
                );
            }
        )
    ));

    fetchAttachmentSourcesStart = createEffect(() => this.actions$.pipe(
        ofType(fetchAttachmentSourcesStart),
        mergeMap((action) => {
            return this.httpClient.get<HypermediaResultList<QuerySource>>(GET_POST_ATTACHMENT_SOURCES
                    .replace(":userId", action.userId)
                    .replace(":postId", action.postId)
                    .replace(":attachmentId", action.attachmentId), {
                    params: new HttpParams()
                        // TODO probably needs pagination
                        .append("size", 100),
                    headers: new HttpHeaders()
                        .append("Accept", RESPONSE_TYPE)
                },
            ).pipe(
                map(sourcesResponse => {
                    let sources: QuerySource[] = [];

                    if (!!sourcesResponse._embedded) {
                        sources = sourcesResponse._embedded.sourceSnapshotList;
                    }

                    return fetchAttachmentSourcesSuccess({
                        attachmentId: action.attachmentId,
                        attachmentSources: sources
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
                                errorMessage = 'Attachment was not found and sources could not be fetched. Try again in a moment.';
                                break;
                            default:
                                errorMessage = 'Something went wrong. Try again later.';
                                break;
                        }

                        return of(fetchAttachmentSourcesFail({
                            attachmentId: action.attachmentId,
                            errorMessage: errorMessage
                        }));
                    })
            );
            }
        )
    ));

    removeMediaFromPostStart = createEffect(() => this.actions$.pipe(
        ofType(removeMediaFromPostStart),
        mergeMap((action) => {
                return this.httpClient.delete<HypermediaResultList<QuerySource>>(DELETE_MEDIA
                    .replace(":userId", action.userId)
                    .replace(":postId", action.postId)
                    .replace(":mediaId", action.mediaId),
                ).pipe(
                    map(() => {
                        return removeMediaFromPostSuccess({
                            mediaId: action.mediaId
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
                                errorMessage = 'Media was not found and could not be deleted. Try again later.';
                                break;
                            default:
                                errorMessage = 'Something went wrong. Try again later.';
                                break;
                        }

                        return of(removeMediaFromPostFail({
                            mediaId: action.mediaId,
                            errorMessage: errorMessage
                        }));
                    })
                );
            }
        )
    ));

    removeAttachmentFromPostStart = createEffect(() => this.actions$.pipe(
        ofType(removeAttachmentFromPostStart),
        mergeMap((action) => {
                return this.httpClient.delete<HypermediaResultList<QuerySource>>(DELETE_ATTACHMENT
                    .replace(":userId", action.userId)
                    .replace(":postId", action.postId)
                    .replace(":attachmentId", action.attachmentId),
                ).pipe(
                    map(() => {
                        return removeAttachmentFromPostSuccess({
                            attachmentId: action.attachmentId
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
                                errorMessage = 'Attachment was not found and could not be deleted. Try again later.';
                                break;
                            default:
                                errorMessage = 'Something went wrong. Try again later.';
                                break;
                        }

                        return of(removeAttachmentFromPostFail({
                            attachmentId: action.attachmentId,
                            errorMessage: errorMessage
                        }));
                    })
                );
            }
        )
    ));

    replaceMediaSetStart = createEffect(() => this.actions$.pipe(
        ofType(replaceMediaSetStart),
        mergeMap((action) => {
            const data = new FormData();

            const mediaSet = [...action.mediaSet];
            const mediaWrapper: MediaWrapper = {...mediaSet[action.currentIndex]};
            const media = {...mediaWrapper.media};

            // If current media has not changed then skip it
            if (!mediaWrapper.hasChanged) {
                // If last media in set
                if (action.currentIndex == action.mediaSet.length - 1) {
                    return of(replaceMediaSetSuccess({
                        mediaSet: action.mediaSet
                    }));
                } else {
                    return of(replaceMediaSetStart({
                        userId: action.userId,
                        postId: action.postId,
                        currentIndex: action.currentIndex + 1,
                        mediaSet: action.mediaSet
                    }));
                }
            }

            // Overwrite priority based on index given by user
            media.priority = mediaSet.length - action.currentIndex - 1;

            data.append("media", new Blob([JSON.stringify(media)], {
                type: "application/json"
            }));

            // If file changed and path to it exists
            if (!!mediaWrapper.mediaFile.webkitRelativePath) {
                data.append("file", mediaWrapper.mediaFile, mediaWrapper.mediaFile.name);
            }
            // If thumbnail changed and path to it exists
            if (!!mediaWrapper.thumbnailFile && !!mediaWrapper.thumbnailFile.webkitRelativePath) {
                data.append("thumbnail", mediaWrapper.thumbnailFile, mediaWrapper.thumbnailFile.name);
            }

            let request;


            // If media not existing
            if (!mediaWrapper.mediaId) {
                request = this.buildCreateMediaRequest(
                    action.userId,
                    action.postId,
                    data
                );
            } else {
                request = this.buildReplaceMediaRequest(
                    action.userId,
                    action.postId,
                    mediaWrapper.mediaId,
                    data
                );
            }

            return request.pipe(
                map(response => {
                    mediaSet[action.currentIndex] = mediaWrapper;

                    // If all media are replaced
                    if (action.currentIndex == action.mediaSet.length - 1) {
                        return replaceMediaSetSuccess({
                            mediaSet: mediaSet
                        });
                    }

                    return replaceMediaSetStart({
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
                            return of(savePostFail({
                                errorMessage: 'No servers available to handle your request. Try again later.'
                            }));
                        case 404:
                            return of(savePostFail({
                                errorMessage: error.error.message + ' If you think this is a bug, please contact the administrator.'
                            }));
                        case 400:
                            return of(savePostFail({
                                errorMessage: error.error.message + ' If you think this is a bug, please contact the administrator.'
                            }));
                        default:
                            return of(savePostFail({
                                errorMessage: 'Something went wrong while updating media. The update of other media has been canceled.'
                            }));
                    }
                })
            );
        })
    ));
    replaceMediaSetSuccess = createEffect(() => this.actions$.pipe(
        ofType(replaceMediaSetSuccess),
        tap(() => {
            this.postCreateService.postSaveStatusChangeEvent.emit(PostSaveStatusEnum.MEDIA_UPDATED);
        })
    ), {dispatch: false});
    savePostSuccess = createEffect(() => this.actions$.pipe(
        ofType(savePostSuccess),
        tap(() => {
            this.postCreateService.postSaveStatusChangeEvent.emit(PostSaveStatusEnum.POST_UPDATED);
        })
    ), {dispatch: false});

    private buildCreateMediaRequest(userId: string, postId: string, data: FormData): Observable<HttpResponse<Object>> {
        return this.httpClient.post(CREATE_MEDIA
                .replace(":userId", userId)
                .replace(":postId", postId),
            data, {observe: 'response'})
    }

    private buildReplaceMediaRequest(userId: string, postId: string, mediaId: string, data: FormData): Observable<HttpResponse<Object>> {
        return this.httpClient.patch(UPDATE_MEDIA
                .replace(":userId", userId)
                .replace(":postId", postId)
                .replace(":mediaId", mediaId),
            data, {observe: 'response'})
    }

    createPostSuccess = createEffect(() => this.actions$.pipe(
        ofType(createPostSuccess),
        tap(() => {
            this.postCreateService.postCreateStatusChangeEvent.emit(PostCreateStatusEnum.POST_CREATED);
        })
    ), {dispatch: false});

    // On last thing created in post
    createAttachmentsSourcesSuccess = createEffect(() => this.actions$.pipe(
        ofType(createAttachmentsSourcesSuccess),
        tap(() => {
            this.postCreateService.postCreateStatusChangeEvent.emit(PostCreateStatusEnum.ATTACHMENTS_SOURCES_CREATED);
        })
    ), {dispatch: false});

    artistFetchSuccess = createEffect(() => this.actions$.pipe(
        ofType(fetchArtistAfterCreationSuccess),
        tap(() => {
            this.postCreateService.clearPostCreateSideStepModalEvent.emit();
        })
    ), {dispatch: false});

    createArtistSourceSuccess = createEffect(() => this.actions$.pipe(
        ofType(createArtistSourceSuccess),
        map(action => {
            this.postCreateService.clearPostCreateSideStepModalEvent.emit();

            return addArtistSourceAfterCreationStart({
                userId: action.userId,
                artistId: action.artistId,
                sourceId: action.sourceId
            });
        })
    ));

    addMedia = createEffect(() => this.actions$.pipe(
        ofType(addMedia),
        tap(() => {
            this.postCreateService.clearPostCreateSideStepModalEvent.emit();
        })
    ), {dispatch: false});

    addAttachment = createEffect(() => this.actions$.pipe(
        ofType(addAttachment),
        tap(() => {
            this.postCreateService.clearPostCreateSideStepModalEvent.emit();
        })
    ), {dispatch: false});

    loadPostToEdit = createEffect(() => this.actions$.pipe(
        ofType(loadPostToEdit),
        tap(action => {
            // Load artists with sources
            action.post.artists.forEach(artist => {
                this.store.dispatch(addArtistToSelectedSetStart({
                    userId: action.post.ownerId,
                    preferredNickname: artist.preferredNickname
                }));
            });

            // Load attachment sources
            action.post.attachments.forEach(attachment => {
                this.store.dispatch(fetchAttachmentSourcesStart({
                    userId: action.post.ownerId,
                    postId: action.post.postId,
                    attachmentId: attachment.attachmentId
                }));
            });

            // Load media sources
            action.post.mediaSet.forEach(media => {
                this.store.dispatch(fetchMediaSourcesStart({
                    userId: action.post.ownerId,
                    postId: action.post.postId,
                    mediaId: media.mediaId
                }));
            });
        })
    ), {dispatch: false});

    constructor(
        private store: Store<fromApp.AppState>,
        private router: Router,
        private actions$: Actions,
        private httpClient: HttpClient,
        private postCreateService: PostCreateService,
        private postsService: PostsService
    ) {
    }
}
