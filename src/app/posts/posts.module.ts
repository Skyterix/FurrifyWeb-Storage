import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavComponent} from "./nav/nav.component";
import {PostsComponent} from "./posts.component";
import {PostsRoutingModule} from "./posts-routing.module";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {ReactiveFormsModule} from "@angular/forms";
import {SearchComponent} from './nav/search/search.component';
import {PostListComponent} from './post-list/post-list.component';
import {PostItemComponent} from './post-list/post-item/post-item.component';
import {SharedModule} from "../shared/shared.module";
import {SortNavComponent} from './post-list/sort-nav/sort-nav.component';
import {PostViewComponent} from './post-view/post-view.component';
import {PostItemsComponent} from './post-view/post-items/post-items.component';
import {PostDetailsComponent} from './post-view/post-details/post-details.component';


@NgModule({
    declarations: [
        PostsComponent,
        NavComponent,
        SearchComponent,
        PostListComponent,
        PostItemComponent,
        SortNavComponent,
        PostViewComponent,
        PostItemsComponent,
        PostDetailsComponent
    ],
    imports: [
        CommonModule,
        FontAwesomeModule,
        PostsRoutingModule,
        ReactiveFormsModule,
        SharedModule
    ]
})
export class PostsModule {
}
