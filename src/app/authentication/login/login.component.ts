import {Component} from '@angular/core';
import {KeycloakService} from "keycloak-angular";
import {PlatformLocation} from "@angular/common";

@Component({
    selector: 'app-authentication-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {

    constructor(private pLocation: PlatformLocation,
                private readonly keycloak: KeycloakService) {
    }

    signIn(): void {
        this.keycloak.login({
            // Fix for use_hash strategy
            redirectUri: (this.pLocation as any).location.href
        });
    }

    signUp(): void {
        this.keycloak.register({
            // Fix for use_hash strategy
            redirectUri: (this.pLocation as any).location.href
        });
    }

}
