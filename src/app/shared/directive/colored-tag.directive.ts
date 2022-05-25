import {Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {TagColorsConfig} from "../config/tag-colors.config";

@Directive({
    selector: '[appColoredTag]'
})
export class ColoredTagDirective implements OnInit {

    @Input('appColoredTag') type!: string;

    constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    }

    ngOnInit(): void {
        this.addBackgroundToBadge();
    }

    addBackgroundToBadge(): void {
        const tagColor = TagColorsConfig.getTagColorByType(this.type);

        this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', tagColor.background);
        this.renderer.setStyle(this.elementRef.nativeElement, 'color', tagColor.color);
    }
}
