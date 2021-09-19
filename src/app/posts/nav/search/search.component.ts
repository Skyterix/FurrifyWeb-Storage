import {Component, OnDestroy, OnInit} from '@angular/core';
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons/faCircleNotch";
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons/faTimesCircle";
import {faSearch} from "@fortawesome/free-solid-svg-icons/faSearch";
import {FormControl, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";

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

    constructor() {
        this.searchForm = new FormGroup({
            query: new FormControl(null)
        });
    }

    ngOnInit() {
        // Check if search query is filled, if yes then display clear icon
        this.queryChangeSubscription =
            this.searchForm.controls.query.valueChanges.subscribe(value => {
                this.isSearchFilled = !!value;
            });
    }

    ngOnDestroy() {
        this.queryChangeSubscription.unsubscribe();
    }

    // TODO Impement
    onSearchQuery(): void {
        this.isSearching = true;

        setTimeout(() => {
            this.isSearching = false;
        }, 600)
    }

    clearSearchQuery(): void {
        this.searchForm.setValue({
            query: ''
        });
    }
}
