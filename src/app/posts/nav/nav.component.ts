import {Component, OnDestroy, OnInit} from '@angular/core';
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons/faCircleNotch";
import {faSearch} from "@fortawesome/free-solid-svg-icons/faSearch";
import {FormControl, FormGroup} from "@angular/forms";
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons/faTimesCircle";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-posts-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {

    circleNotchIcon = faCircleNotch;
    searchIcon = faSearch;

    timesCircleIcon = faTimesCircle;

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
