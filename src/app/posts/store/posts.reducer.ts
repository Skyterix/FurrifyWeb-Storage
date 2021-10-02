import {Post} from '../../shared/model/post.model';
import {PageInfo} from '../../shared/model/page-info.model';
import {
    DEFAULT_SEARCH_ORDER,
    DEFAULT_SEARCH_PAGE,
    DEFAULT_SEARCH_SIZE,
    DEFAULT_SEARCH_SORT_BY
} from "../../shared/config/search.defaults";
import {createReducer, on} from "@ngrx/store";
import {
    failSearch,
    getPostFail,
    getPostStart,
    getPostSuccess,
    selectPost,
    startSearch,
    successSearch,
    updateSearchParams,
    updateSearchQuery
} from "./posts.actions";

export interface State {
    isFetching: boolean;
    order: string;
    sortBy: string;
    query: string;
    size: number;
    page: number;
    searchErrorMessage: string | null;
    fetchErrorMessage: string | null;
    posts: Post[];
    pageInfo: PageInfo | null;
    selectedPost: Post | null;
}

const initialState: State = {
    isFetching: false,
    order: DEFAULT_SEARCH_ORDER,
    sortBy: DEFAULT_SEARCH_SORT_BY,
    query: '',
    size: DEFAULT_SEARCH_SIZE,
    page: DEFAULT_SEARCH_PAGE,
    searchErrorMessage: null,
    fetchErrorMessage: null,
    posts: [],
    pageInfo: null,
    selectedPost: null
};


export const postsReducer = createReducer(
    initialState,
    on(startSearch, (state) => {
            return {
                ...state,
                isFetching: true,
                searchErrorMessage: null,
                selectedPost: null,
                selectedMedia: null
            }
        }
    ),
    on(successSearch, (state, action) => {
            return {
                ...state,
                posts: action.posts,
                pageInfo: action.pageInfo,
                isFetching: false
            }
        }
    ),
    on(failSearch, (state, action) => {
            return {
                ...state,
                searchErrorMessage: action.searchErrorMessage,
                isFetching: false
            }
        }
    ),
    on(updateSearchQuery, (state, action) => {
            return {
                ...state,
                query: action.query
            }
        }
    ),
    on(updateSearchParams, (state, action) => {
            return {
                ...state,
                order: action.order,
                sortBy: action.sortBy,
                size: action.size
            }
        }
    ),
    on(selectPost, (state, action) => {
            return {
                ...state,
                selectedPost: action.post
            }
        }
    ),
    on(getPostStart, (state, action) => {
            return {
                ...state,
                isFetching: true,
                selectedPost: null,
                selectedMedia: null
            }
        }
    ),
    on(getPostFail, (state, action) => {
            return {
                ...state,
                isFetching: false,
                fetchErrorMessage: action.postFetchErrorMessage
            }
        }
    ),
    on(getPostSuccess, (state, action) => {
            return {
                ...state,
                isFetching: false,
                selectedPost: action.post
            }
        }
    )
);
