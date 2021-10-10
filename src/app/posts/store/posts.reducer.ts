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
    removeTagFromSelected,
    selectPost,
    startSearch,
    successSearch,
    updatePostSavedDescription,
    updatePostSavedTitle,
    updateSearchParams,
    updateSearchQuery
} from "./posts.actions";
import {Tag} from "../../shared/model/tag.model";

export class TagWrapper {
    constructor(public tag: Tag,
                public isExisting: boolean | null) {
    }
}

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
    // Create Post
    selectedTags: TagWrapper[];
    postSavedTitle: string;
    postSavedDescription: string;
    tagErrorMessage: string;
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
    // Create Post
    selectedTags: [],
    postSavedTitle: "",
    postSavedDescription: "",
    tagErrorMessage: ""
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
    ),
    on(updatePostSavedTitle, (state, action) => {
            return {
                ...state,
                postSavedTitle: action.title
            }
        }
    ),
    on(updatePostSavedDescription, (state, action) => {
            return {
                ...state,
                postSavedDescription: action.description
            }
        }
    ),
    on(addTagToSelectedSetStart, (state, action) => {
            const tag: Tag = {
                title: "",
                description: "",
                ownerId: "",
                type: "",
                value: action.value,
                createDate: new Date()
            };

            return {
                ...state,
                isFetching: true,
                postErrorMessage: null,
                // Set temporarily isExisting value to null to show loading spinner
                selectedTags: [...state.selectedTags, new TagWrapper(tag, null)]
            };
        }
    ),
    on(addTagToSelectedSetSuccess, (state, action) => {
            const newSelectedTags = state.selectedTags.slice();

            // Find tag with same value
            const oldSelectedTagIndex = newSelectedTags.findIndex((tagWrapper) => {
                return tagWrapper.tag.value === action.tagWrapper.tag.value;
            });

            // Replace old tag with new one
            newSelectedTags[oldSelectedTagIndex] = action.tagWrapper;

            return {
                ...state,
                isFetching: false,
                selectedTags: newSelectedTags
            };
        }
    ),
    on(addTagToSelectedSetFail, (state, action) => {
            return {
                ...state,
                isFetching: false,
                postErrorMessage: action.errorMessage,
                selectedTags: state.selectedTags.slice().filter(item => item.tag.value !== action.value)
            };
        }
    ),
    on(createTagStart, (state, action) => {
            return {
                ...state,
                isFetching: true,
                tagErrorMessage: ""
            };
        }
    ),
    on(createTagFail, (state, action) => {
            return {
                ...state,
                isFetching: false,
                tagErrorMessage: action.errorMessage
            };
        }
    ),
    on(fetchTagAfterCreationStart, (state, action) => {
            return {
                ...state,
                isFetching: true,
                tagErrorMessage: ""
            };
        }
    ),
    on(fetchTagAfterCreationFail, (state, action) => {
            return {
                ...state,
                isFetching: false,
                tagErrorMessage: action.errorMessage
            };
        }
    ),
    on(fetchTagAfterCreationSuccess, (state, action) => {
            const newTags = state.selectedTags.slice();

            // Find tag with same value
            const oldTagIndex = newTags.findIndex((tagWrapper) => {
                return tagWrapper.tag.value === action.tag.value;
            });

            // Replace old tag with new one
            newTags[oldTagIndex] = new TagWrapper(action.tag, true);

            return {
                ...state,
                isFetching: false,
                selectedTags: newTags
            };
        }
    ),
    on(removeTagFromSelected, (state, action) => {
            return {
                ...state,
                selectedTags: state.selectedTags.slice().filter(item => item.tag !== action.tag)
            };
        }
    )
);
