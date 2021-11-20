import {Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild} from '@angular/core';
import {faCaretDown} from "@fortawesome/free-solid-svg-icons/faCaretDown";
import {KeycloakService} from "keycloak-angular";
import {PostsService} from "../posts.service";
import {faTimes} from "@fortawesome/free-solid-svg-icons/faTimes";
import {faBars} from "@fortawesome/free-solid-svg-icons/faBars";

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

    menuToggleIcon = faBars;
    caretDownIcon = faCaretDown;

    isUserDropdownOpened = false;
    isMenuOpen = false;
    username!: string;

    @ViewChild('menuRef')
    menuRef!: ElementRef;

    constructor(private keycloakService: KeycloakService,
                private postsService: PostsService,
                private renderer: Renderer2) {
    }

    ngOnInit() {
        this.username = this.keycloakService.getUsername();
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event) {
        if (this.isUserDropdownOpened && !this.menuRef.nativeElement.contains(event.target)) {
            this.toggleUserDropdown();
        }

    }

    toggleUserDropdown(): void {
        this.isUserDropdownOpened = !this.isUserDropdownOpened;
    }

    logout(): void {
        this.keycloakService.logout();
    }

    onMenuToggle(): void {
        if (!this.isMenuOpen) {
            this.menuToggleIcon = faTimes;
            this.renderer.setStyle(this.menuRef.nativeElement, 'display', 'block');
        } else {
            this.menuToggleIcon = faBars;
            this.renderer.setStyle(this.menuRef.nativeElement, 'display', 'none');
        }

        this.isMenuOpen = !this.isMenuOpen;
    }

    triggerSearch(): void {
        // Let it navigate first
        setTimeout(() => {
            this.postsService.triggerSearch();
        });
    }
}
