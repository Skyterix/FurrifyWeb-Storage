import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {KeycloakService} from "keycloak-angular";

@Component({
    selector: 'app-authentication-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {

    constructor(private router: Router,
                private readonly keycloak: KeycloakService) {
    }

    signIn(): void {
        this.keycloak.login({
            redirectUri: window.location.origin + this.router.routerState.snapshot.url
        });
    }

    signUp(): void {
        this.keycloak.register({
            redirectUri: window.location.origin + this.router.routerState.snapshot.url
        });
    }

}
