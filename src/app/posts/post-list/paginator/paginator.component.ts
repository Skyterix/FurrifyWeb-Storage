import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import * as fromApp from "../../../store/app.reducer";
import {Subscription} from "rxjs";
import {PageInfo} from "../../../shared/model/page-info.model";
import {faAngleDoubleLeft} from "@fortawesome/free-solid-svg-icons/faAngleDoubleLeft";
import {faAngleDoubleRight} from "@fortawesome/free-solid-svg-icons/faAngleDoubleRight";
import {PostsService} from "../../posts.service";

@Component({
    selector: 'app-paginator',
    templateUrl: './paginator.component.html',
    styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit {

    doubleChevronLeft = faAngleDoubleLeft;
    doubleChevronRight = faAngleDoubleRight;
    currentPage!: number;
    pageInfo!: PageInfo | null;

    private storeSubscription!: Subscription;

    constructor(private store: Store<fromApp.AppState>, private postsService: PostsService) {
    }

    ngOnInit(): void {
        this.storeSubscription = this.store.select('posts').subscribe(state => {
            this.pageInfo = state.pageInfo;
            this.currentPage = state.page;
        });
    }

    triggerSearch(): void {
        // Let router params be updated first
        setTimeout(() => {
            if (this.currentPage === this.pageInfo?.number) {
                return;
            }

            this.postsService.triggerSearch();
        });
    }
}
