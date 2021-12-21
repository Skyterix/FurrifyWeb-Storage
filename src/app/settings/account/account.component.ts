import {Component, OnInit} from '@angular/core';
import {KeycloakService} from "keycloak-angular";

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

    username!: string;
    providers: {
        name: string,
        id: string,
        color: string,
        accent: string,
        logoUrl: string
    }[] = [
        {
            name: "DeviantArt",
            id: 'deviantart',
            color: "#06070d",
            accent: "#fff",
            logoUrl: "./assets/providers/deviantart.png"
        },
        {
            name: "Patreon",
            id: 'patreon',
            color: "#fff",
            accent: "#052d49",
            logoUrl: "./assets/providers/patreon.png"
        }
    ];

    constructor(private keycloakService: KeycloakService) {
    }

    ngOnInit(): void {
        this.username = this.keycloakService.getUsername();
    }

}
