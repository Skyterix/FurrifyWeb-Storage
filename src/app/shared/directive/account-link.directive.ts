import {Directive, HostListener, Input} from '@angular/core';
import {Router} from "@angular/router";
import {KeycloakService} from "keycloak-angular";
import {KeycloakTokenUtils} from "../util/keycloak-token.utils";
import * as CryptoJS from 'crypto-js';
import base64url from "base64url";
import {KEYCLOAK_AUTH_URL, KEYCLOAK_CLIENT_ID, KEYCLOAK_PROVIDER_LINK} from "../config/api.constants";

@Directive({
    selector: '[appAccountLink]'
})
export class AccountLinkDirective {

    @Input('appAccountLink') provider!: string;


    constructor(private router: Router,
                private keycloakService: KeycloakService) {
    }

    private static generateUri(token: any, providerId: string, clientId: string): string {
        let uri: string = KEYCLOAK_AUTH_URL + KEYCLOAK_PROVIDER_LINK.replace(':provider', providerId);
        const nonce: string = this.randomString(32);
        const sessionState: string = token.session_state;
        const input: string = nonce + sessionState + clientId + providerId;
        const check: any = CryptoJS.SHA256(CryptoJS.enc.Utf8.parse(input));
        const hash: string = AccountLinkDirective.base64url(check);
        const redirectUri = window.location.href;

        uri += '?nonce=' + nonce;
        uri += '&hash=' + hash;
        uri += '&client_id=' + clientId;
        uri += '&redirect_uri=' + redirectUri;

        return uri;
    }

    private static base64url(source: any): string {
        const hash = CryptoJS.enc.Base64.stringify(source).toString();

        return base64url.fromBase64(hash);
    }

    private static randomString(length: number): string {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    @HostListener('click', ['$event'])
    onClick($event: any): void {
        this.keycloakService.getToken().then(token => {
            const tokenObj = KeycloakTokenUtils.parseToken(token);
            if (tokenObj === null) {
                return;
            }

            // Open provider connect site
            window.location.href = AccountLinkDirective.generateUri(tokenObj, this.provider, KEYCLOAK_CLIENT_ID);
        });
    }
}
