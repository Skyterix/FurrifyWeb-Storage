import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {KeycloakService} from "keycloak-angular";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    public isLoggedIn = false;

    constructor(private router: Router,
                private readonly keycloak: KeycloakService) {
    }

    async ngOnInit() {
        this.isLoggedIn = await this.keycloak.isLoggedIn();

        if (this.isLoggedIn) {
        }
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
