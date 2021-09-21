import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import * as fromApp from "./store/app.reducer";
import {KeycloakService} from "keycloak-angular";
import {updateCurrentUser} from "./authentication/store/authentication.actions";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'FurrifyWeb-Storage';

    constructor(private store: Store<fromApp.AppState>, private keycloak: KeycloakService) {
    }

    ngOnInit(): void {
        this.keycloak.loadUserProfile().then(profile => {
            this.store.dispatch(updateCurrentUser({
                currentUser: profile
            }));
        });
    }

}
