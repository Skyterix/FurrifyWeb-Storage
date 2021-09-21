import {ActionReducerMap} from '@ngrx/store';

import * as fromPosts from '../posts/store/posts.reducer';
import * as fromAuthentication from '../authentication/store/authentication.reducer';

export interface AppState {
    posts: fromPosts.State;
    authentication: fromAuthentication.State;
}

export const appReducerMap: ActionReducerMap<AppState> = {
    posts: fromPosts.postsReducer,
    authentication: fromAuthentication.authenticationReducer
};
