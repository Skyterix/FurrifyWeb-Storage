import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";
import * as fromApp from '../../../store/app.reducer';
import {updateSearchParams} from "../../store/posts.actions";
import {PostsService} from "../../posts.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-sort-nav',
    templateUrl: './sort-nav.component.html',
    styleUrls: ['./sort-nav.component.css']
})
export class SortNavComponent implements OnInit {

    sortForm!: FormGroup;

    sortBy!: string;
    order!: string;
    size!: number;

    constructor(private store: Store<fromApp.AppState>,
                private postsService: PostsService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.store.select('posts').subscribe(state => {
            this.sortBy = state.sortBy;
            this.order = state.order;
            this.size = state.size;
        });

        this.sortForm = new FormGroup({
            sortBy: new FormControl(this.sortBy, Validators.required),
            order: new FormControl(this.order, Validators.required),
            size: new FormControl(this.size, Validators.required)
        });
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
                size: this.sortForm.controls.size.value
            })
        );

        this.postsService.triggerSearch();
    }

    onCreatePost(): void {
        // TODO Implement
        alert("Not implemented yet.");
    }
}
