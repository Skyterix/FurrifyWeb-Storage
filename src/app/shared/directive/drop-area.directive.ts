import {Directive, ElementRef, Renderer2} from '@angular/core';

@Directive({
    selector: '[appDropArea]'
})
export class DropAreaDirective {

    constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    }


    ngOnInit(): void {
        this.addDropIdToElementRef();
    }

    addDropIdToElementRef(): void {
        this.renderer.setAttribute(this.elementRef.nativeElement, "id", "drop-area");
    }
}
