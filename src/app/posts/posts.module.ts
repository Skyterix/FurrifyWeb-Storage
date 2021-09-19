import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavComponent} from "./nav/nav.component";
import {PostsComponent} from "./posts.component";
import {PostsRoutingModule} from "./posts-routing.module";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {ReactiveFormsModule} from "@angular/forms";
import {SearchComponent} from './nav/search/search.component';


@NgModule({
    declarations: [
        PostsComponent,
        NavComponent,
        SearchComponent
    ],
    imports: [
        CommonModule,
        FontAwesomeModule,
        PostsRoutingModule,
        ReactiveFormsModule
    ]
})
export class PostsModule {
}
