import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {PostCreateService} from "../post-create.service";
import {Store} from "@ngrx/store";
import * as fromApp from "../../../store/app.reducer";

@Component({
    selector: 'app-post-create-steps-menu',
    templateUrl: './post-create-steps-menu.component.html',
    styleUrls: ['./post-create-steps-menu.component.css']
})
export class PostCreateStepsMenuComponent implements OnInit {

    @ViewChild('firstStepCircle') firstStepCircle!: ElementRef;
    @ViewChild('secondStepCircle') secondStepCircle!: ElementRef;
    @ViewChild('thirdStepCircle') thirdStepCircle!: ElementRef;

    private isFetching!: boolean;

    private postInfoOpenEventSubscription!: Subscription;
    private postContentOpenEventSubscription!: Subscription;
    private postContentUploadOpenEventSubscription!: Subscription;

    constructor(private renderer: Renderer2,
                private postCreateService: PostCreateService,
                private store: Store<fromApp.AppState>) {
    }

    ngOnInit(): void {
        this.store.select('posts').subscribe(state => {
            this.isFetching = state.isFetching;
        });

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

    ngOnDestroy(): void {
        this.postInfoOpenEventSubscription.unsubscribe();
        this.postContentOpenEventSubscription.unsubscribe()
        this.postContentUploadOpenEventSubscription.unsubscribe()
    }

    onPostInfoStepClicked(): void {
        if (this.isFetching) {
            return;
        }

        this.postCreateService.postInfoStepOpenEvent.emit();
    }

    onPostContentStepClicked(): void {
        if (this.isFetching) {
            return;
        }

        this.postCreateService.postContentStepOpenEvent.emit();
    }

    onPostContentUploadStepClicked(): void {
        if (this.isFetching) {
            return;
        }

        this.postCreateService.postUploadStepOpenEvent.emit();
    }
}
