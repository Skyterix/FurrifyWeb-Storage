import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {DELETE_ARTIST, GET_ARTIST, GET_ARTIST_SOURCES, RESPONSE_TYPE} from '../../shared/config/api.constants';
import {of} from 'rxjs';
import {
    deleteArtistFail,
    deleteArtistStart,
    deleteArtistSuccess,
    getArtistFail,
    getArtistSourcesFail,
    getArtistSourcesStart,
    getArtistSourcesSuccess,
    getArtistStart,
    getArtistSuccess
} from './artists.actions';
import {Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import {HypermediaResultList} from "../../shared/model/hypermedia-result-list.model";
import {QueryArtist} from "../../shared/model/query/query-artist.model";
import {Router} from "@angular/router";
import {QuerySource} from "../../shared/model/query/query-source.model";

@Injectable()
export class ArtistsEffects {

    getArtistStart = createEffect(() => this.actions$.pipe(
        ofType(getArtistStart),
        switchMap((action) => {
            return this.httpClient.get<QueryArtist>(
                GET_ARTIST
                    .replace(":userId", action.userId)
                    .replace(":artistId", action.artistId), {
                    headers: new HttpHeaders()
                        .append("Accept", RESPONSE_TYPE)
                }).pipe(
                map(artist => {
                    return getArtistSuccess({
                        artist: artist
                    });
                }),
                catchError(error => {
                    switch (error.status) {
                        case 503:
                            return of(getArtistFail({
                                artistFetchErrorMessage: 'No servers available to handle your request. Try again later.'
                            }));
                        case 404:
                            return of(getArtistFail({
                                artistFetchErrorMessage: 'Artist does not exists.'
                            }));
                        case 400:
                            return of(getArtistFail({
                                artistFetchErrorMessage: error.error.message + ' If you think this is a bug, please contact the administrator.'
                            }));
                        default:
                            return of(getArtistFail({
                                artistFetchErrorMessage: 'Something went wrong. Try again later.'
                            }));
                    }
                })
            );
        })
    ));

    getArtistSourcesStart = createEffect(() => this.actions$.pipe(
        ofType(getArtistSourcesStart),
        switchMap((action) => {
            return this.httpClient.get<HypermediaResultList<QuerySource>>(
                GET_ARTIST_SOURCES
                    .replace(":userId", action.userId)
                    .replace(":artistId", action.artistId), {
                    params: new HttpParams()
                        // TODO probably needs pagination
                        .append("size", 100),
                    headers: new HttpHeaders()
                        .append("Accept", RESPONSE_TYPE)
                }).pipe(
                map(sources => {
                    return getArtistSourcesSuccess({
                        sources: sources._embedded.sourceSnapshotList
                    });
                }),
                catchError(error => {
                    switch (error.status) {
                        case 503:
                            return of(getArtistSourcesFail({
                                errorMessage: 'No servers available to handle your request. Try again later.'
                            }));
                        case 404:
                            return of(getArtistSourcesFail({
                                errorMessage: 'Artist media does not exists.'
                            }));
                        case 400:
                            return of(getArtistSourcesFail({
                                errorMessage: error.error.message + ' If you think this is a bug, please contact the administrator.'
                            }));
                        default:
                            return of(getArtistSourcesFail({
                                errorMessage: 'Something went wrong. Try again later.'
                            }));
                    }
                })
            );
        })
    ));

    deleteArtistStart = createEffect(() => this.actions$.pipe(
        ofType(deleteArtistStart),
        switchMap((action) => {
            return this.httpClient.delete(DELETE_ARTIST
                .replace(":userId", action.userId)
                .replace(":artistId", action.artistId), {
                observe: 'response'
            }).pipe(
                map(response => {
                    return deleteArtistSuccess({
                        artistId: action.artistId
                    });
                }),
                catchError(error => {
                    switch (error.status) {
                        case 503:
                            return of(deleteArtistFail({
                                errorMessage: 'No servers available to handle your request. Try again later.'
                            }));
                        case 400:
                            return of(deleteArtistFail({
                                errorMessage: error.error.message + ' If you think this is a bug, please contact the administrator.'
                            }));
                        default:
                            return of(deleteArtistFail({
                                errorMessage: 'Something went wrong. Try again later.'
                            }));
                    }
                })
            );
        })
    ));

    deleteArtistSuccess = createEffect(() => this.actions$.pipe(
        ofType(deleteArtistSuccess),
        tap(() => {
            this.router.navigate(['/'], {queryParamsHandling: "merge"});
        })
    ), {dispatch: false});

    constructor(
        private store: Store<fromApp.AppState>,
        private router: Router,
        private actions$: Actions,
        private httpClient: HttpClient
    ) {
    }
}
