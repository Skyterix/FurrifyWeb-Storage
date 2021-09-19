import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {AppRoutingModule} from "./app-routing.module";
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {KEYCLOAK_AUTH_URL, KEYCLOAK_CLIENT_ID, KEYCLOAK_REALM} from "./shared/config/api.constants";
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from '../environments/environment';

function initializeKeycloak(keycloak: KeycloakService) {
    return () =>
        keycloak.init({
            config: {
                url: KEYCLOAK_AUTH_URL,
                realm: KEYCLOAK_REALM,
                clientId: KEYCLOAK_CLIENT_ID,
            },
            initOptions: {
                pkceMethod: "S256",
                onLoad: 'check-sso',
                silentCheckSsoRedirectUri:
                    window.location.origin + '/assets/silent-check-sso.html',
            },
            enableBearerInterceptor: true,
            bearerExcludedUrls: ['/assets', '/auth/login'],
            loadUserProfileAtStartUp: true
        }).catch(error => console.error('[Error] Keycloak init failed', error));
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        KeycloakAngularModule,
        StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production}),
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: initializeKeycloak,
            multi: true,
            deps: [KeycloakService],
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
