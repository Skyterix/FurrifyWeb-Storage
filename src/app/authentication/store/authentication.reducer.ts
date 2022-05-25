import {createReducer, on} from "@ngrx/store";
import {KeycloakProfile} from "keycloak-js";
import {updateCurrentUser} from "./authentication.actions";

export interface State {
    currentUser: KeycloakProfile | null;
}

const initialState: State = {
    currentUser: null
};

export const authenticationReducer = createReducer(
    initialState,
    on(updateCurrentUser, (state, action) => {
            return {
                ...state,
                currentUser: action.currentUser
            }
        }
    )
);
