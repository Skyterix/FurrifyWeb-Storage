import {createReducer, on} from "@ngrx/store";
import {
    addArtistSourceAfterCreationFail,
    addArtistSourceAfterCreationStart,
    addArtistSourceAfterCreationSuccess,
    addArtistToSelectedSetFail,
    addArtistToSelectedSetStart,
    addArtistToSelectedSetSuccess,
    addAttachment,
    addAttachmentSource,
    addMedia,
    addMediaSource,
    addTagToSelectedSetFail,
    addTagToSelectedSetStart,
    addTagToSelectedSetSuccess,
    clearPostData,
    clearSourceData,
    createArtistFail,
    createArtistSourceFail,
    createArtistSourceStart,
    createArtistSourceSuccess,
    createArtistStart,
    createAttachmentsSourcesStart,
    createAttachmentsSourcesSuccess,
    createAttachmentsStart,
    createAttachmentsSuccess,
    createMediaSetSourcesStart,
    createMediaSetStart,
    createMediaSetSuccess,
    createPostFail,
    createPostStart,
    createPostSuccess,
    createTagFail,
    createTagStart,
    fetchArtistAfterCreationFail,
    fetchArtistAfterCreationSuccess,
    fetchArtistSourcesFail,
    fetchArtistSourcesStart,
    fetchArtistSourcesSuccess,
    fetchTagAfterCreationFail,
    fetchTagAfterCreationSuccess,
    removeArtistFromSelected,
    removeArtistSourceFail,
    removeArtistSourceStart,
    removeArtistSourceSuccess,
    removeAttachment,
    removeMedia,
    removeSourceFromAttachment,
    removeSourceFromMedia,
    removeTagFromSelected,
    updateMediaSet,
    updatePostSavedDescription,
    updatePostSavedTitle,
    updateSourceData
} from "./post-create.actions";
import {Tag} from "../../../shared/model/tag.model";
import {Artist} from "../../../shared/model/artist.model";
import {CreateMedia} from "../../../shared/model/request/create-media.model";
import {CreateSource} from "../../../shared/model/request/create-source.model";
import {CreateAttachment} from "../../../shared/model/request/create-attachment.model";
import {QuerySource} from "../../../shared/model/query/query-source.model";

export class ArtistWrapper {
    constructor(public artist: Artist,
                public sources: QuerySource[],
                public status: WrapperStatus,
                public sourcesFetchingStatus: WrapperSourcesFetchingStatus) {
    }
}

export class TagWrapper {
    constructor(public tag: Tag,
                public status: WrapperStatus) {
    }
}

export class MediaWrapper {
    mediaId: string;

    constructor(public media: CreateMedia,
                public sources: CreateSource[],
                public mediaFile: File,
                public thumbnailFile: File | undefined) {
        this.mediaId = "";
    }
}

export class AttachmentWrapper {
    attachmentId: string;

    constructor(public attachment: CreateAttachment,
                public sources: CreateSource[],
                public file: File) {
        this.attachmentId = "";
    }
}

export enum WrapperStatus {
    // Request to backend not yet send
    NOT_QUERIED,
    FOUND,
    NOT_FOUND
}

export enum WrapperSourcesFetchingStatus {
    // Request to backend not yet send
    NOT_QUERIED,
    IN_PROGRESS,
    COMPLETED
}

export interface State {
    // Create Post
    isErrorPostCreationRelated: boolean;
    currentlyFetchingCount: number;
    selectedTags: TagWrapper[];
    selectedArtists: ArtistWrapper[];
    postSavedTitle: string;
    postSavedDescription: string;
    tagErrorMessage: string | null;
    artistErrorMessage: string | null;
    mediaSet: MediaWrapper[];
    attachments: AttachmentWrapper[];
    postCreateErrorMessage: string | null;
    artistSourceCreateErrorMessage: string | null;
    createSourceData: any;
    createdPostId: string;
    currentIndex: number;
    currentSourceIndex: number
}

const initialState: State = {
    // Create Post
    isErrorPostCreationRelated: false,
    currentlyFetchingCount: 0,
    selectedTags: [],
    selectedArtists: [],
    postSavedTitle: "",
    postSavedDescription: "",
    tagErrorMessage: null,
    artistErrorMessage: null,
    mediaSet: [],
    attachments: [],
    postCreateErrorMessage: null,
    artistSourceCreateErrorMessage: null,
    createSourceData: {},
    createdPostId: "",
    currentIndex: 0,
    currentSourceIndex: 0
};

export const postCreateReducer = createReducer(
    initialState,
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
                ownerId: "",
                type: "",
                value: action.value,
                createDate: new Date()
            };

            return {
                ...state,
                currentlyFetchingCount: state.currentlyFetchingCount + 1,
                postCreateErrorMessage: null,
                // Set temporarily isExisting value to null to show loading spinner
                selectedTags: [...state.selectedTags, new TagWrapper(tag, WrapperStatus.NOT_QUERIED)]
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
                currentlyFetchingCount: state.currentlyFetchingCount - 1,
                selectedTags: newSelectedTags
            };
        }
    ),
    on(addTagToSelectedSetFail, (state, action) => {
            return {
                ...state,
                currentlyFetchingCount: state.currentlyFetchingCount - 1,
                postCreateErrorMessage: action.errorMessage,
                selectedTags: state.selectedTags.slice().filter(item => item.tag.value !== action.value)
            };
        }
    ),
    on(createTagStart, (state, action) => {
            return {
                ...state,
                currentlyFetchingCount: state.currentlyFetchingCount + 1,
                tagErrorMessage: null
            };
        }
    ),
    on(createTagFail, (state, action) => {
            return {
                ...state,
                currentlyFetchingCount: state.currentlyFetchingCount - 1,
                tagErrorMessage: action.errorMessage
            };
        }
    ),
    on(fetchTagAfterCreationFail, (state, action) => {
            return {
                ...state,
                currentlyFetchingCount: state.currentlyFetchingCount - 1,
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
            newTags[oldTagIndex] = new TagWrapper(action.tag, WrapperStatus.FOUND);

            return {
                ...state,
                currentlyFetchingCount: state.currentlyFetchingCount - 1,
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
                avatar: null,
                sources: [],
                createDate: new Date()
            };

            return {
                ...state,
                currentlyFetchingCount: state.currentlyFetchingCount + 1,
                postCreateErrorMessage: null,
                // Set temporarily isExisting value to null to show loading spinner
                selectedArtists: [...state.selectedArtists, new ArtistWrapper(artist, [], WrapperStatus.NOT_QUERIED, WrapperSourcesFetchingStatus.NOT_QUERIED)]
            };
        }
    ),
    on(addArtistToSelectedSetSuccess, (state, action) => {
            const newSelectedArtists = state.selectedArtists.slice();

            // Find artist with same value
            const oldSelectedArtistIndex = newSelectedArtists.findIndex((artistWrapper) => {
                return artistWrapper.artist.preferredNickname.toLowerCase() === action.artistWrapper.artist.preferredNickname.toLowerCase();
            });

            // Replace old artist with new one
            newSelectedArtists[oldSelectedArtistIndex] = action.artistWrapper;

            return {
                ...state,
                currentlyFetchingCount: state.currentlyFetchingCount - 1,
                selectedArtists: newSelectedArtists
            };
        }
    ),
    on(addArtistToSelectedSetFail, (state, action) => {
            return {
                ...state,
                currentlyFetchingCount: state.currentlyFetchingCount - 1,
                postCreateErrorMessage: action.errorMessage,
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
    on(createMediaSetSuccess, (state, action) => {
            return {
                ...state,
                mediaSet: action.mediaSet
            };
        }
    ),
    on(createArtistStart, (state, action) => {
            return {
                ...state,
                currentlyFetchingCount: state.currentlyFetchingCount + 1,
                artistErrorMessage: null
            };
        }
    ),
    on(createArtistFail, (state, action) => {
            return {
                ...state,
                currentlyFetchingCount: state.currentlyFetchingCount - 1,
                artistErrorMessage: action.errorMessage
            };
        }
    ),
    on(fetchArtistAfterCreationFail, (state, action) => {
            return {
                ...state,
                currentlyFetchingCount: state.currentlyFetchingCount - 1,
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
        newArtists[oldArtistIndex] = new ArtistWrapper(action.artist, [], WrapperStatus.FOUND, WrapperSourcesFetchingStatus.NOT_QUERIED);

            return {
                ...state,
                currentlyFetchingCount: state.currentlyFetchingCount - 1,
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
                currentlyFetchingCount: state.currentlyFetchingCount + 1,
                postCreateErrorMessage: null,
                isErrorPostCreationRelated: false,
                currentIndex: 0,
                currentSourceIndex: 0
            };
        }
    ),
    on(createPostSuccess, (state, action) => {
            return {
                ...state,
                currentlyFetchingCount: state.currentlyFetchingCount - 1,
                createdPostId: action.postId
            };
        }
    ),
    on(createPostFail, (state, action) => {
            return {
                ...state,
                currentlyFetchingCount: state.currentlyFetchingCount - 1,
                postCreateErrorMessage: action.errorMessage,
                isErrorPostCreationRelated: true
            };
        }
    ),
    on(createMediaSetStart, (state, action) => {
        return {
            ...state,
            currentlyFetchingCount: state.currentlyFetchingCount + 1,
            postCreateErrorMessage: null,
            isErrorPostCreationRelated: false,
            currentIndex: action.currentIndex
        };
    }),
    on(createAttachmentsStart, (state, action) => {
        return {
            ...state,
            currentlyFetchingCount: state.currentlyFetchingCount + 1,
            postCreateErrorMessage: null,
            isErrorPostCreationRelated: false,
            currentIndex: action.currentIndex
        };
    }),
    on(createMediaSetSourcesStart, (state, action) => {
        return {
            ...state,
            currentlyFetchingCount: state.currentlyFetchingCount + 1,
            postCreateErrorMessage: null,
            isErrorPostCreationRelated: false,
            currentIndex: action.currentMediaIndex,
            currentSourceIndex: action.currentSourceIndex
        };
    }),
    on(createAttachmentsSourcesStart, (state, action) => {
        return {
            ...state,
            currentlyFetchingCount: state.currentlyFetchingCount + 1,
            postCreateErrorMessage: null,
            isErrorPostCreationRelated: false,
            currentIndex: action.currentAttachmentIndex,
            currentSourceIndex: action.currentSourceIndex
        };
    }),
    on(createAttachmentsSuccess, (state, action) => {
            return {
                ...state,
                attachments: action.attachments
            };
        }
    ),
    on(createAttachmentsSourcesSuccess, (state, action) => {
            return {
                ...state,
                currentlyFetchingCount: state.currentlyFetchingCount - 1
            };
        }
    ),
    on(removeSourceFromMedia, (state, action) => {
            const modifiedMediaSet = state.mediaSet.slice().map((media, index) => {
                if (index !== action.mediaIndex) {
                    return media;
                }

                const newMedia = {...media};

                newMedia.sources = media.sources.filter(
                    (source, index) => index !== action.sourceIndex
                );

                return newMedia;
            });

            return {
                ...state,
                mediaSet: modifiedMediaSet
            };
        }
    ),
    on(removeSourceFromAttachment, (state, action) => {
            const modifiedAttachmentSet = state.attachments.slice().map((attachment, index) => {
                if (index !== action.attachmentIndex) {
                    return attachment;
                }

                const newAttachment = {...attachment};

                newAttachment.sources = attachment.sources.filter(
                    (source, index) => index !== action.sourceIndex
                );

                return newAttachment;
            });

            return {
                ...state,
                attachments: modifiedAttachmentSet
            };
        }
    ),
    on(clearSourceData, (state, action) => {
            return {
                ...state,
                createSourceData: null
            };
        }
    ),
    on(updateSourceData, (state, action) => {
            return {
                ...state,
                createSourceData: action.data
            };
        }
    ),
    on(addMediaSource, (state, action) => {
            let newMedia = {...state.mediaSet[action.mediaIndex]}
            newMedia.sources = [...newMedia.sources, action.source];

            let newMediaSet = [...state.mediaSet]
            newMediaSet[action.mediaIndex] = newMedia;

            return {
                ...state,
                mediaSet: newMediaSet
            };
        }
    ),
    on(addAttachmentSource, (state, action) => {
            let newAttachment = {...state.attachments[action.attachmentIndex]}
            newAttachment.sources = [...newAttachment.sources, action.source];

            let newAttachments = [...state.attachments]
            newAttachments[action.attachmentIndex] = newAttachment;

            return {
                ...state,
                attachments: newAttachments
            };
        }
    ),
    on(clearPostData, (state, action) => {
            return {
                ...state,
                selectedTags: [],
                selectedArtists: [],
                postSavedTitle: "",
                postSavedDescription: "",
                tagErrorMessage: null,
                artistErrorMessage: null,
                mediaSet: [],
                attachments: [],
                postCreateErrorMessage: null,
                createSourceData: {},
                createdPostId: ""
            };
        }
    ),
    on(fetchArtistSourcesStart, (state, action) => {
            const artistIndex = state.selectedArtists.findIndex((artistWrapper) => {
                return artistWrapper.artist.artistId === action.artistId;
            });

            const newArtists = [...state.selectedArtists];

            const newArtist = {...newArtists[artistIndex]};
            newArtist.sources = [];
            newArtist.sourcesFetchingStatus = WrapperSourcesFetchingStatus.IN_PROGRESS;


            newArtists[artistIndex] = newArtist;

            return {
                ...state,
                selectedArtists: newArtists,
                postCreateErrorMessage: null
            };
        }
    ),
    on(fetchArtistSourcesFail, (state, action) => {
            const artistIndex = state.selectedArtists.findIndex((artistWrapper) => {
                return artistWrapper.artist.artistId === action.artistId;
            });

            const newArtists = [...state.selectedArtists];

            const newArtist = {...newArtists[artistIndex]};
        newArtist.sourcesFetchingStatus = WrapperSourcesFetchingStatus.COMPLETED;

            newArtists[artistIndex] = newArtist;

            return {
                ...state,
                selectedArtists: newArtists,
                postCreateErrorMessage: action.errorMessage
            };
        }
    ),
    on(fetchArtistSourcesSuccess, (state, action) => {
            const artistIndex = state.selectedArtists.findIndex((artistWrapper) => {
                return artistWrapper.artist.artistId === action.artistId;
            });

            const newArtists = [...state.selectedArtists];

            const newArtist = {...newArtists[artistIndex]};
            newArtist.sources = action.artistSources;
            newArtist.sourcesFetchingStatus = WrapperSourcesFetchingStatus.COMPLETED;

            newArtists[artistIndex] = newArtist;

            return {
                ...state,
                selectedArtists: newArtists
            };
        }
    ),
    on(removeArtistSourceStart, (state, action) => {
            const artistIndex = state.selectedArtists.findIndex((artistWrapper) => {
                return artistWrapper.artist.artistId === action.artistId;
            });

            let newArtists: ArtistWrapper[] = [...state.selectedArtists];
            const newArtist: ArtistWrapper = {...newArtists[artistIndex]};

            const sourceIndex = newArtist.sources.findIndex((source) => {
                return source.sourceId === action.sourceId;
            });

            // Set is fetching for spinner to display
            const newSources = [...newArtist.sources];
            const newSource = {...newSources[sourceIndex]};
            newSource.isFetching = true;

            // Overwrite old source with the new one
            newSources[sourceIndex] = newSource;
            newArtist.sources = newSources;

            // Overwrite old artist with the new one
            newArtists[artistIndex] = newArtist;

            return {
                ...state,
                selectedArtists: newArtists,
                postCreateErrorMessage: null
            };
        }
    ),
    on(removeArtistSourceFail, (state, action) => {
            const artistIndex = state.selectedArtists.findIndex((artistWrapper) => {
                return artistWrapper.artist.artistId === action.artistId;
            });

            let newArtists: ArtistWrapper[] = [...state.selectedArtists];
            const newArtist: ArtistWrapper = {...newArtists[artistIndex]};

            const sourceIndex = newArtist.sources.findIndex((source) => {
                return source.sourceId === action.sourceId;
            });

            // Set is fetching for spinner to display
            const newSources = [...newArtist.sources];
            const newSource = {...newSources[sourceIndex]};
            newSource.isFetching = false;

            // Overwrite old source with the new one
            newSources[sourceIndex] = newSource;
            newArtist.sources = newSources;

            // Overwrite old artist with the new one
            newArtists[artistIndex] = newArtist;

            return {
                ...state,
                selectedArtists: newArtists,
                postCreateErrorMessage: action.errorMessage
            };
        }
    ),
    on(removeArtistSourceSuccess, (state, action) => {
            const artistIndex = state.selectedArtists.findIndex((artistWrapper) => {
                return artistWrapper.artist.artistId === action.artistId;
            });

            const newArtists = [...state.selectedArtists];
            const newArtist = {...newArtists[artistIndex]};

            let newSources = [...newArtist.sources];
            // Remove artist source by source id
            newSources = newSources.filter((source) => {
                return source.sourceId !== action.sourceId;
            });

            newArtist.sources = newSources;

            // Overwrite old artist with new one
            newArtists[artistIndex] = newArtist;

            return {
                ...state,
                selectedArtists: newArtists
            };
        }
    ),
    on(createArtistSourceStart, (state, action) => {
            return {
                ...state,
                currentlyFetchingCount: state.currentlyFetchingCount + 1,
                artistSourceCreateErrorMessage: null
            };
        }
    ),
    on(createArtistSourceSuccess, (state, action) => {
            return {
                ...state,
                currentlyFetchingCount: state.currentlyFetchingCount - 1
            };
        }
    ),
    on(createArtistSourceFail, (state, action) => {
            return {
                ...state,
                currentlyFetchingCount: state.currentlyFetchingCount - 1,
                artistSourceCreateErrorMessage: action.errorMessage
            };
        }
    ),
    on(addArtistSourceAfterCreationStart, (state, action) => {
            const artistIndex = state.selectedArtists.findIndex((artistWrapper) => {
                return artistWrapper.artist.artistId === action.artistId;
            });

            const newArtists = [...state.selectedArtists];

            const newArtist = {...newArtists[artistIndex]};
        newArtist.sourcesFetchingStatus = WrapperSourcesFetchingStatus.IN_PROGRESS;


            newArtists[artistIndex] = newArtist;

            return {
                ...state,
                selectedArtists: newArtists,
                postCreateErrorMessage: null
            };
        }
    ),
    on(addArtistSourceAfterCreationFail, (state, action) => {
            const artistIndex = state.selectedArtists.findIndex((artistWrapper) => {
                return artistWrapper.artist.artistId === action.artistId;
            });

            const newArtists = [...state.selectedArtists];

            const newArtist = {...newArtists[artistIndex]};
        newArtist.sourcesFetchingStatus = WrapperSourcesFetchingStatus.COMPLETED;

            newArtists[artistIndex] = newArtist;

            return {
                ...state,
                selectedArtists: newArtists,
                postCreateErrorMessage: action.errorMessage
            };
        }
    ),
    on(addArtistSourceAfterCreationSuccess, (state, action) => {
            const artistIndex = state.selectedArtists.findIndex((artistWrapper) => {
                return artistWrapper.artist.artistId === action.artistId;
            });

            const newArtists = [...state.selectedArtists];

            const newArtist = {...newArtists[artistIndex]};

            newArtist.sources = [...newArtist.sources, action.source];
            newArtist.sourcesFetchingStatus = WrapperSourcesFetchingStatus.COMPLETED;

            newArtists[artistIndex] = newArtist;

            return {
                ...state,
                selectedArtists: newArtists
            };
        }
    ),
);
