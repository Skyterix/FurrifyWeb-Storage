import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {PostCreateService} from "../post-create.service";

@Component({
    selector: 'app-post-create-steps-menu',
    templateUrl: './post-create-steps-menu.component.html',
    styleUrls: ['./post-create-steps-menu.component.css']
})
export class PostCreateStepsMenuComponent implements OnInit {

    @ViewChild('firstStepCircle') firstStepCircle!: ElementRef;
    @ViewChild('secondStepCircle') secondStepCircle!: ElementRef;
    @ViewChild('thirdStepCircle') thirdStepCircle!: ElementRef;

    private postInfoOpenEventSubscription!: Subscription;
    private postContentOpenEventSubscription!: Subscription;
    private postContentUploadOpenEventSubscription!: Subscription;

    constructor(private renderer: Renderer2, private postCreateService: PostCreateService) {
    }

    ngOnInit(): void {
        this.postInfoOpenEventSubscription = this.postCreateService.postInfoStepOpenEvent.subscribe(() => {
            this.renderer.addClass(this.firstStepCircle.nativeElement, 'active');
            this.renderer.removeClass(this.secondStepCircle.nativeElement, 'active');
            this.renderer.removeClass(this.thirdStepCircle.nativeElement, 'active');
        });
        this.postContentOpenEventSubscription = this.postCreateService.postContentStepOpenEvent.subscribe(() => {
            this.renderer.addClass(this.firstStepCircle.nativeElement, 'active');
            this.renderer.addClass(this.secondStepCircle.nativeElement, 'active');
            this.renderer.removeClass(this.thirdStepCircle.nativeElement, 'active');
        });
        this.postContentUploadOpenEventSubscription = this.postCreateService.postUploadStepOpenEvent.subscribe(() => {
            this.renderer.addClass(this.firstStepCircle.nativeElement, 'active');
            this.renderer.addClass(this.secondStepCircle.nativeElement, 'active');
            this.renderer.addClass(this.thirdStepCircle.nativeElement, 'active');
        });
    }

    onPostInfoStepClicked(): void {
        this.postCreateService.postInfoStepOpenEvent.emit();
    }

    onPostContentStepClicked(): void {
        this.postCreateService.postContentStepOpenEvent.emit();
    }

    onPostContentUploadStepClicked(): void {
        this.postCreateService.postUploadStepOpenEvent.emit();
    }
}
