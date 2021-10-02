import {Component, OnDestroy, OnInit} from '@angular/core';
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons/faCircleNotch";
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons/faTimesCircle";
import {faSearch} from "@fortawesome/free-solid-svg-icons/faSearch";
import {FormControl, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {PostsService} from "../../posts.service";
import {Store} from "@ngrx/store";
import * as fromApp from "../../../store/app.reducer";

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

    circleNotchIcon = faCircleNotch;
    timesCircleIcon = faTimesCircle;
    searchIcon = faSearch;

    isSearching = false;
    isSearchFilled = false;

    searchForm: FormGroup;

    private queryChangeSubscription!: Subscription;
    private storeSubscription!: Subscription;

    constructor(private activatedRoute: ActivatedRoute,
                private postsService: PostsService,
                private router: Router,
                private store: Store<fromApp.AppState>) {
        this.searchForm = new FormGroup({
            query: new FormControl(null)
        });

        this.storeSubscription = this.store.select('posts').subscribe(state => {
            this.isSearching = state.isFetching;
        });
    }

    ngOnInit() {
        // Check if search query is filled, if yes then display clear icon
        this.queryChangeSubscription =
            this.searchForm.controls.query.valueChanges.subscribe(value => {
                this.isSearchFilled = !!value;
            });

        // Update search params on query params change
        this.activatedRoute.queryParams.subscribe(params => {
            // Update query search form on params change
            this.searchForm.patchValue({
                query: params.query
            });
        });
    }

    ngOnDestroy() {
        this.queryChangeSubscription.unsubscribe();
        this.storeSubscription.unsubscribe();
    }

    onSearchQuery(): void {
        this.router.navigate(
            ['/'],
            {
                queryParams: {
                    query: this.searchForm.controls.query.value
                },
                queryParamsHandling: "merge"
            }
        );

        // Let params change first
        setTimeout(() => {
            this.postsService.triggerSearch();
        });
    }

    clearSearchQuery(): void {
        this.searchForm.setValue({
            query: ''
        });
    }
}
