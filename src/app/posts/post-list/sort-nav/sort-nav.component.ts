import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";
import * as fromApp from '../../../store/app.reducer';
import {updateSearchParams} from "../../store/posts.actions";
import {PostsService} from "../../posts.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {PostCreateService} from "../../post-create/post-create.service";

@Component({
    selector: 'app-sort-nav',
    templateUrl: './sort-nav.component.html',
    styleUrls: ['./sort-nav.component.css']
})
export class SortNavComponent implements OnInit, OnDestroy {

    sortForm!: FormGroup;

    sortBy!: string;
    order!: string;
    size!: number;
    page!: number;

    private storeSubscription!: Subscription;

    constructor(private store: Store<fromApp.AppState>,
                private postsService: PostsService,
                private postCreateService: PostCreateService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.storeSubscription = this.store.select('posts').subscribe(state => {
            this.sortBy = state.sortBy;
            this.order = state.order;
            this.size = state.size;
        });

        this.sortForm = new FormGroup({
            sortBy: new FormControl(this.sortBy, Validators.required),
            order: new FormControl(this.order, Validators.required),
            size: new FormControl(this.size, Validators.required),
            page: new FormControl(this.size, Validators.required)
        });
    }

    ngOnDestroy(): void {
        this.storeSubscription.unsubscribe();
    }

    onChanges(): void {
        this.router.navigate(
            ['/'],
            {
                queryParams: {
                    sortBy: this.sortForm.controls.sortBy.value,
                    order: this.sortForm.controls.order.value,
                    size: this.sortForm.controls.size.value
                },
                queryParamsHandling: "merge"
            });

        this.store.dispatch(
            updateSearchParams({
                sortBy: this.sortForm.controls.sortBy.value,
                order: this.sortForm.controls.order.value,
                size: this.sortForm.controls.size.value,
                page: this.page
            })
        );

        this.postsService.triggerSearch();
    }

    onCreatePost(): void {
        this.postCreateService.postCreateOpenEvent.emit();
    }
}
