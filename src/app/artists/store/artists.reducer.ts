import {createReducer, on} from "@ngrx/store";
import {QuerySource} from "../../shared/model/query/query-source.model";
import {QueryArtist} from "../../shared/model/query/query-artist.model";
import {
    deleteArtistFail,
    deleteArtistStart,
    deleteArtistSuccess,
    getArtistFail,
    getArtistSourcesStart,
    getArtistSourcesSuccess,
    getArtistStart,
    getArtistSuccess
} from "./artists.actions";
import {getPostMediaSourcesFail} from "../../posts/store/posts.actions";

export interface State {
    isFetching: boolean;
    fetchErrorMessage: string | null;
    selectedArtist: QueryArtist | null;
    areArtistSourcesFetching: boolean;
    fetchSourcesErrorMessage: string | null;
    artistDeleteErrorMessage: string | null;
    selectedArtistSources: QuerySource[];
}

const initialState: State = {
    isFetching: false,
    fetchErrorMessage: null,
    selectedArtist: null,
    areArtistSourcesFetching: true,
    fetchSourcesErrorMessage: null,
    artistDeleteErrorMessage: null,
    selectedArtistSources: []
};


export const artistsReducer = createReducer(
    initialState,
    on(getArtistStart, (state, action) => {
            return {
                ...state,
                isFetching: true,
                fetchSourcesErrorMessage: null,
                selectedArtist: null
            }
        }
    ),
    on(getArtistFail, (state, action) => {
            return {
                ...state,
                isFetching: false,
                fetchErrorMessage: action.artistFetchErrorMessage
            }
        }
    ),
    on(getArtistSuccess, (state, action) => {
            return {
                ...state,
                isFetching: false,
                selectedArtist: action.artist
            }
        }
    ),
    on(deleteArtistStart, (state, action) => {
            return {
                ...state,
                isFetching: true
            };
        }
    ),
    on(deleteArtistFail, (state, action) => {
            return {
                ...state,
                // Filter out deleted artist
                artistDeleteErrorMessage: action.errorMessage,
                isFetching: false
            };
        }
    ),
    on(deleteArtistSuccess, (state, action) => {
            return {
                ...state,
                // Filter out deleted artist
                isFetching: false
            };
        }
    ),
    on(getArtistSourcesStart, (state, action) => {
            return {
                ...state,
                areArtistSourcesFetching: true,
                fetchSourcesErrorMessage: null,
                selectedArtistSources: []
            }
        }
    ),
    on(getPostMediaSourcesFail, (state, action) => {
            return {
                ...state,
                areArtistSourcesFetching: false,
                fetchSourcesErrorMessage: action.errorMessage
            }
        }
    ),
    on(getArtistSourcesSuccess, (state, action) => {
            return {
                ...state,
                areArtistSourcesFetching: false,
                selectedArtistSources: action.sources
            }
        }
    ),
);
