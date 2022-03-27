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
        // TODO Implement me

        switch (this.source.originType) {
            case "ARTIST":
                alert("Not implemented yet.")
                break;
            case "MEDIA":
                alert("Not implemented yet.")
                break;
            case "ATTACHMENT":
                alert("Not implemented yet.")
                break;
        }
    }

}
