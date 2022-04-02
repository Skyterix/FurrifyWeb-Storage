import {createAction, props} from '@ngrx/store';
import {QuerySource} from "../../shared/model/query/query-source.model";
import {QueryArtist} from "../../shared/model/query/query-artist.model";

// Artists

export const getArtistStart = createAction(
    '[Artists] Get artist start',
    props<{
        userId: string,
        artistId: string
    }>()
);

export const getArtistSuccess = createAction(
    '[Artists] Get artist success',
    props<{
        artist: QueryArtist
    }>()
);

export const getArtistFail = createAction(
    '[Artists] Get artist fail',
    props<{ artistFetchErrorMessage: string }>()
);

export const selectArtist = createAction(
    '[Artists] Select artist',
    props<{ artist: QueryArtist | null }>()
);

export const deleteArtistStart = createAction(
    '[Artists] Delete artist start',
    props<{ userId: string, artistId: string }>()
);

export const deleteArtistSuccess = createAction(
    '[Artists] Delete artist success',
    props<{ artistId: string }>()
);

export const deleteArtistFail = createAction(
    '[Artists] Delete artist fail',
    props<{ errorMessage: string }>()
);

export const getArtistSourcesStart = createAction(
    '[Artists] Get artist sources start',
    props<{ userId: string, artistId: string }>()
);

export const getArtistSourcesFail = createAction(
    '[Artists] Get artist sources fail',
    props<{ errorMessage: string }>()
);

export const getArtistSourcesSuccess = createAction(
    '[Artists] Get artist sources success',
    props<{ sources: QuerySource[] }>()
);
