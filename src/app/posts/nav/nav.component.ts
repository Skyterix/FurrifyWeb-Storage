import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
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

    @ViewChild('menu')
    menuRef!: ElementRef;

    constructor(private keycloakService: KeycloakService) {
    }

    ngOnInit() {
        this.username = this.keycloakService.getUsername();
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event) {
        if (this.isMenuOpened && !this.menuRef.nativeElement.contains(event.target)) {
            this.toggleMenu();
        }

    }

    toggleMenu(): void {
        this.isMenuOpened = !this.isMenuOpened;
    }

    logout(): void {
        this.keycloakService.logout();
    }

    onMenuToggle() {

    }
}
