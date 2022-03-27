import {PageInfo} from '../../shared/model/page-info.model';
import {
    DEFAULT_SEARCH_ORDER,
    DEFAULT_SEARCH_PAGE,
    DEFAULT_SEARCH_SIZE,
    DEFAULT_SEARCH_SORT_BY
} from "../../shared/config/search.defaults";
import {createReducer, on} from "@ngrx/store";
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
    selectPost,
    startSearch,
    successSearch,
    updateSearchParams,
    updateSearchQuery
} from "./posts.actions";
import {QueryPost} from "../../shared/model/query/query-post.model";
import {QuerySource} from "../../shared/model/query/query-source.model";

export interface State {
    isFetching: boolean;
    order: string;
    sortBy: string;
    query: string;
    size: number;
    page: number;
    searchErrorMessage: string | null;
    fetchErrorMessage: string | null;
    posts: QueryPost[];
    pageInfo: PageInfo | null;
    selectedPost: QueryPost | null;
    areSourcesFetching: boolean;
    fetchSourcesErrorMessage: string;
    selectedPostMediaSources: QuerySource[];
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
    selectedPost: null,
    areSourcesFetching: true,
    fetchSourcesErrorMessage: "",
    selectedPostMediaSources: []
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
                size: action.size,
                page: action.page
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
    ),
    on(deletePostStart, (state, action) => {
            return {
                ...state,
                isFetching: true
            };
        }
    ),
    on(deletePostFail, (state, action) => {
            return {
                ...state,
                // Filter out deleted post
                postDeleteErrorMessage: action.errorMessage,
                isFetching: false
            };
        }
    ),
    on(deletePostSuccess, (state, action) => {
            return {
                ...state,
                // Filter out deleted post
                posts: state.posts.filter(post => post.postId !== action.postId),
                isFetching: false
            };
        }
    ),
    on(getPostMediaSourcesStart, (state, action) => {
            return {
                ...state,
                areSourcesFetching: true,
                fetchSourcesErrorMessage: "",
                selectedPostMediaSources: []
            }
        }
    ),
    on(getPostMediaSourcesFail, (state, action) => {
            return {
                ...state,
                areSourcesFetching: false,
                fetchSourcesErrorMessage: action.errorMessage
            }
        }
    ),
    on(getPostMediaSourcesSuccess, (state, action) => {
            return {
                ...state,
                areSourcesFetching: false,
                selectedPostMediaSources: action.sources
            }
        }
    ),
);
