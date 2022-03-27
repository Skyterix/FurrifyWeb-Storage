import {createAction, props} from '@ngrx/store';
import {PageInfo} from '../../shared/model/page-info.model';
import {QueryPost} from "../../shared/model/query/query-post.model";
import {QuerySource} from "../../shared/model/query/query-source.model";

// Posts

export const updateSearchParams = createAction(
    '[Posts] Update search params',
    props<{ sortBy: string, order: string, size: number, page: number }>()
);

export const updateSearchQuery = createAction(
    '[Posts] Update search query',
    props<{ query: string }>()
);

export const startSearch = createAction(
    '[Posts] Search start',
    props<{
        query: string,
        sortBy: string,
        order: string,
        size: number,
        page: number,
        userId: string
    }>()
);

export const getPostStart = createAction(
    '[Posts] Get post start',
    props<{
        userId: string,
        postId: string
    }>()
);

export const getPostSuccess = createAction(
    '[Posts] Get post success',
    props<{
        post: QueryPost
    }>()
);

export const getPostFail = createAction(
    '[Posts] Get post fail',
    props<{ postFetchErrorMessage: string }>()
);

export const failSearch = createAction(
    '[Posts] Search fail',
    props<{ searchErrorMessage: string }>()
);

export const successSearch = createAction(
    '[Posts] Search success',
    props<{ posts: QueryPost[], pageInfo: PageInfo }>()
);

export const selectPost = createAction(
    '[Posts] Select post',
    props<{ post: QueryPost | null }>()
);

export const deletePostStart = createAction(
    '[Posts] Delete post start',
    props<{ userId: string, postId: string }>()
);

export const deletePostSuccess = createAction(
    '[Posts] Delete post success',
    props<{ postId: string }>()
);

export const deletePostFail = createAction(
    '[Posts] Delete post fail',
    props<{ errorMessage: string }>()
);

export const getPostMediaSourcesStart = createAction(
    '[Posts] Get post media sources start',
    props<{ userId: string, postId: string, mediaId: string }>()
);

export const getPostMediaSourcesFail = createAction(
    '[Posts] Get post media sources fail',
    props<{ errorMessage: string }>()
);

export const getPostMediaSourcesSuccess = createAction(
    '[Posts] Get post media sources success',
    props<{ sources: QuerySource[] }>()
);
