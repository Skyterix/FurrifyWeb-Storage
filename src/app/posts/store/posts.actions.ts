import {createAction, props} from '@ngrx/store';
import {Post} from '../../shared/model/post.model';
import {PageInfo} from '../../shared/model/page-info.model';

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

export const failSearch = createAction(
    '[Posts] Search fail',
    props<{ searchErrorMessage: string }>()
);

export const successSearch = createAction(
    '[Posts] Search success',
    props<{ posts: Post[], pageInfo: PageInfo }>()
);
