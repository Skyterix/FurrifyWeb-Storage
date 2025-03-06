import {NgModule, provideZoneChangeDetection} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from '../environments/environment';
import {provideKeycloak} from 'keycloak-angular';
import {AppRoutingModule} from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production})
  ],
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideKeycloak({
      config: {
        url: 'https://keycloak.furrify.tech/',
        realm: 'furrify-dev',
        clientId: 'furrifyws-storage'
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
      }
    })
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
