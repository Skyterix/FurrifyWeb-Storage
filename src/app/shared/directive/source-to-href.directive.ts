import {Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {QuerySource} from "../model/query/query-source.model";

@Directive({
    selector: '[appSourceToHref]'
})
export class SourceToHrefDirective implements OnInit {

    @Input('appSourceToHref')
    source!: QuerySource;

    constructor(private elementRef: ElementRef,
                private renderer: Renderer2) {
    }

    ngOnInit(): void {
        if (!this.source.data.url) {
            return;
        }

        this.renderer.setAttribute(this.elementRef.nativeElement, "href", this.source.data.url)
    }

}
