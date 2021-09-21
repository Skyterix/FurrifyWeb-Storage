import {createAction, props} from '@ngrx/store';
import {KeycloakProfile} from "keycloak-js";

export const updateCurrentUser = createAction(
    '[Authentication] Update current user',
    props<{ currentUser: KeycloakProfile }>()
);
