import {Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";
import * as fromApp from '../../../store/app.reducer';
import {updateSearchParams} from "../../store/posts.actions";
import {PostsService} from "../../posts.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {PostCreateService} from "../../post-create/post-create.service";
import {faTimes} from "@fortawesome/free-solid-svg-icons/faTimes";
import {faFilter} from "@fortawesome/free-solid-svg-icons/faFilter";

@Component({
    selector: 'app-sort-nav',
    templateUrl: './sort-nav.component.html',
    styleUrls: ['./sort-nav.component.css']
})
export class SortNavComponent implements OnInit, OnDestroy {

    sortForm!: FormGroup;

    menuToggleIcon = faFilter;

    isMenuOpen = false;

    sortBy!: string;
    order!: string;
    size!: number;
    page!: number;

    @ViewChild('menuRef')
    menuRef!: ElementRef;

    private storeSubscription!: Subscription;

    constructor(private store: Store<fromApp.AppState>,
                private postsService: PostsService,
                private postCreateService: PostCreateService,
                private router: Router,
                private renderer: Renderer2) {
    }

    ngOnInit(): void {
        this.storeSubscription = this.store.select('posts').subscribe(state => {
            this.sortBy = state.sortBy;
            this.order = state.order;
            this.size = state.size;
            this.page = state.page;
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
        const sortBy = this.sortForm.controls.sortBy.value;
        const order = this.sortForm.controls.order.value;
        const size = this.sortForm.controls.size.value;

        // If values didn't change
        if (this.sortBy == sortBy &&
            this.order == order &&
            this.size == size) {
            return;
        }

        this.router.navigate(
            ['/'],
            {
                queryParams: {
                    sortBy,
                    order,
                    size
                },
                queryParamsHandling: "merge"
            });

        this.store.dispatch(
            updateSearchParams({
                sortBy,
                order,
                size,
                page: this.page
            })
        );

        this.postsService.triggerSearch();
    }

    onCreatePost(): void {
        this.postCreateService.postCreateOpenEvent.emit();
    }

    onMenuToggle(): void {
        if (!this.isMenuOpen) {
            this.menuToggleIcon = faTimes;
            this.renderer.setStyle(this.menuRef.nativeElement, 'display', 'block');
        } else {
            this.menuToggleIcon = faFilter;
            this.renderer.setStyle(this.menuRef.nativeElement, 'display', 'none');
        }

        this.isMenuOpen = !this.isMenuOpen;
    }
}
