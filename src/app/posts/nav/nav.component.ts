import {Component, OnInit} from '@angular/core';
import {faCaretDown} from "@fortawesome/free-solid-svg-icons/faCaretDown";
import {KeycloakService} from "keycloak-angular";

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

    caretDownIcon = faCaretDown;

    isMenuOpened = false;
    username!: string;

    constructor(private keycloakService: KeycloakService) {
    }

    ngOnInit() {
        this.username = this.keycloakService.getUsername();
    }

    toggleMenu(): void {
        this.isMenuOpened = !this.isMenuOpened;
    }

    logout(): void {
        this.keycloakService.logout();
    }

}
