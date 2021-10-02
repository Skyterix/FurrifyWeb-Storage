import {Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {AttachmentIconsConfig} from "../../../shared/config/attachment-icons.config";

@Directive({
    selector: '[appAttachmentIcon]'
})
export class AttachmentIconDirective implements OnInit {

    @Input('appAttachmentIcon') extension!: string;

    constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    }

    ngOnInit(): void {
        this.addSrcToAttachmentIcon();
    }

    addSrcToAttachmentIcon(): void {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'src', AttachmentIconsConfig.getAttachmentIcon(this.extension));
    }
}
