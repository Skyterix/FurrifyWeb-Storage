import {Component, OnInit} from '@angular/core';
import {KeycloakService} from "keycloak-angular";
import {ProvidersConfig} from 'src/app/shared/config/providers.config';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

    username!: string;
    accountRoles!: string[];

    readonly PROVIDER_PREFIX: string = ProvidersConfig.PROVIDER_PREFIX;

    readonly PROVIDERS = ProvidersConfig.PROVIDERS;

    constructor(private keycloakService: KeycloakService) {
    }

    ngOnInit(): void {
        this.username = this.keycloakService.getUsername();
        this.accountRoles = this.keycloakService.getUserRoles();
    }

}
