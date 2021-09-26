import {Directive, ElementRef, HostListener, OnInit, Renderer2} from '@angular/core';

@Directive({
    selector: '[appDropdown]'
})
export class DropdownDirective implements OnInit {

    private isOpen = false;

    private buttonToggleRef!: ElementRef;

    private dropdownRef!: ElementRef;

    constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    }

    ngOnInit(): void {
        const nativeElement = this.elementRef.nativeElement;
        this.buttonToggleRef = nativeElement.querySelector('.dropdown-toggle');
        this.dropdownRef = nativeElement.querySelector('.dropdown-menu');
    }

    @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
        if (!this.elementRef.nativeElement) {
            return;
        }
        this.isOpen = this.elementRef.nativeElement.contains(event.target) ? !this.isOpen : false;

        if (this.isOpen) {
            this.renderer.addClass(this.dropdownRef, 'show');
        } else {
            this.renderer.removeClass(this.dropdownRef, 'show');
        }
    }

}
