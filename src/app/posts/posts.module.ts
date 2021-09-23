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


@NgModule({
    declarations: [
        PostsComponent,
        NavComponent,
        SearchComponent,
        PostListComponent,
        PostItemComponent,
        SortNavComponent
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
