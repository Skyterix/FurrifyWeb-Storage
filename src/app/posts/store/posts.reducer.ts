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
    addArtistToSelectedSetFail,
    addArtistToSelectedSetStart,
    addArtistToSelectedSetSuccess,
    addAttachment,
    addMedia,
    addTagToSelectedSetFail,
    addTagToSelectedSetStart,
    addTagToSelectedSetSuccess,
    createArtistFail,
    createPostFail,
    createPostStart,
    createPostSuccess,
    createPostUploadAttachmentStart,
    createPostUploadMediaStart,
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
    removeArtistFromSelected,
    removeAttachment,
    removeMedia,
    removeTagFromSelected,
    selectPost,
    startSearch,
    successSearch,
    updateMediaSet,
    updatePostSavedDescription,
    updatePostSavedTitle,
    updateSearchParams,
    updateSearchQuery
} from "./posts.actions";
import {Tag} from "../../shared/model/tag.model";
import {Artist} from "../../shared/model/artist.model";
import {CreateMedia} from "../../shared/model/request/create-media.model";
import {CreateAttachment} from "../../shared/model/request/create-attachment.model";

export class ArtistWrapper {
    constructor(public artist: Artist,
                public isExisting: boolean | null) {
    }
}

export class TagWrapper {
    constructor(public tag: Tag,
                public isExisting: boolean | null) {
    }
}

export class MediaWrapper {
    constructor(public media: CreateMedia,
                public file: File) {
    }
}

export class AttachmentWrapper {
    constructor(public attachment: CreateAttachment,
                public file: File) {
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
    selectedArtists: ArtistWrapper[];
    postSavedTitle: string;
    postSavedDescription: string;
    tagErrorMessage: string;
    artistErrorMessage: string;
    mediaSet: MediaWrapper[];
    attachments: AttachmentWrapper[];
    currentMediaUploadIndex: number;
    currentAttachmentUploadIndex: number;
    postCreateErrorMessage: string;
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
    selectedArtists: [],
    postSavedTitle: "",
    postSavedDescription: "",
    tagErrorMessage: "",
    artistErrorMessage: "",
    mediaSet: [],
    attachments: [],
    currentMediaUploadIndex: -1,
    currentAttachmentUploadIndex: -1,
    postCreateErrorMessage: ""
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
    ),
    on(addArtistToSelectedSetStart, (state, action) => {
            const artist = {
                artistId: '',
                ownerId: '',
                nicknames: [],
                preferredNickname: action.preferredNickname,
                sources: [],
                createDate: new Date()
            };

            return {
                ...state,
                isFetching: true,
                postErrorMessage: null,
                // Set temporarily isExisting value to null to show loading spinner
                selectedArtists: [...state.selectedArtists, new ArtistWrapper(artist, null)]
            };
        }
    ),
    on(addArtistToSelectedSetSuccess, (state, action) => {
            const newSelectedArtists = state.selectedArtists.slice();

            // Find artist with same value
            const oldSelectedArtistIndex = newSelectedArtists.findIndex((artistWrapper) => {
                return artistWrapper.artist.preferredNickname === action.artistWrapper.artist.preferredNickname;
            });

            // Replace old artist with new one
            newSelectedArtists[oldSelectedArtistIndex] = action.artistWrapper;

            return {
                ...state,
                isFetching: false,
                selectedArtists: newSelectedArtists
            };
        }
    ),
    on(addArtistToSelectedSetFail, (state, action) => {
            return {
                ...state,
                isFetching: false,
                postErrorMessage: action.errorMessage,
                selectedArtists: state.selectedArtists.slice().filter(item => item.artist.preferredNickname !== action.preferredNickname)
            };
        }
    ),
    on(removeArtistFromSelected, (state, action) => {
            return {
                ...state,
                selectedArtists: state.selectedArtists.slice().filter(item => item.artist !== action.artist)
            };
        }
    ),
    on(createTagStart, (state, action) => {
            return {
                ...state,
                isFetching: true,
                artistErrorMessage: ""
            };
        }
    ),
    on(createArtistFail, (state, action) => {
            return {
                ...state,
                isFetching: false,
                artistErrorMessage: action.errorMessage
            };
        }
    ),
    on(fetchArtistAfterCreationStart, (state, action) => {
            return {
                ...state,
                isFetching: true,
                artistErrorMessage: ""
            };
        }
    ),
    on(fetchArtistAfterCreationFail, (state, action) => {
            return {
                ...state,
                isFetching: false,
                artistErrorMessage: action.errorMessage
            };
        }
    ),
    on(fetchArtistAfterCreationSuccess, (state, action) => {
            const newArtists = state.selectedArtists.slice();

            // Find artist with same value
            const oldArtistIndex = newArtists.findIndex((artistWrapper) => {
                return artistWrapper.artist.preferredNickname === action.artist.preferredNickname;
            });

            // Replace old tag with new one
            newArtists[oldArtistIndex] = new ArtistWrapper(action.artist, true);

            return {
                ...state,
                isFetching: false,
                selectedArtists: newArtists
            };
        }
    ),
    on(addMedia, (state, action) => {
            return {
                ...state,
                mediaSet: [...state.mediaSet, action.mediaWrapper]
            };
        }
    ),
    on(removeMedia, (state, action) => {
            return {
                ...state,
                mediaSet: state.mediaSet.slice().filter((item, index) => index !== action.index)
            };
        }
    ),
    on(updateMediaSet, (state, action) => {
            return {
                ...state,
                mediaSet: [...action.mediaSet]
            };
        }
    ),
    on(addAttachment, (state, action) => {
            return {
                ...state,
                attachments: [...state.attachments, action.attachmentWrapper]
            };
        }
    ),
    on(removeAttachment, (state, action) => {
            return {
                ...state,
                attachments: state.attachments.slice().filter((item, index) => index !== action.index)
            };
        }
    ),
    on(createPostStart, (state, action) => {
            return {
                ...state,
                isFetching: true,
                postCreateErrorMessage: ""
            };
        }
    ),
    on(createPostSuccess, (state, action) => {
            return {
                ...state,
                isFetching: true,
                selectedTags: [],
                selectedArtists: [],
                postSavedTitle: "",
                postSavedDescription: "",
                tagErrorMessage: "",
                artistErrorMessage: "",
                mediaSet: [],
                attachments: [],
                currentMediaUploadIndex: -1,
                currentAttachmentUploadIndex: -1,
                postCreateErrorMessage: ""
            };
        }
    ),
    on(createPostFail, (state, action) => {
            return {
                ...state,
                isFetching: false,
                postCreateErrorMessage: action.errorMessage
            };
        }
    ),
    on(createPostUploadMediaStart, (state, action) => {
            return {
                ...state,
                currentMediaUploadIndex: action.currentIndex
            };
        }
    ),
    on(createPostUploadAttachmentStart, (state, action) => {
            return {
                ...state,
                currentAttachmentUploadIndex: action.currentIndex
            };
        }
    ),
);
