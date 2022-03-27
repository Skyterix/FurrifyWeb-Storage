import {ActionReducerMap} from '@ngrx/store';

import * as fromPosts from '../posts/store/posts.reducer';
import * as fromPostCreate from '../posts/post-create/store/post-create.reducer';
import * as fromAuthentication from '../authentication/store/authentication.reducer';

export interface AppState {
    posts: fromPosts.State;
    postCreate: fromPostCreate.State;
    authentication: fromAuthentication.State;
}

export const appReducerMap: ActionReducerMap<AppState> = {
    posts: fromPosts.postsReducer,
    postCreate: fromPostCreate.postCreateReducer,
    authentication: fromAuthentication.authenticationReducer
};
