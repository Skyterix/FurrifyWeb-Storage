import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavComponent} from "./nav/nav.component";
import {PostsComponent} from "./posts.component";
import {PostsRoutingModule} from "./posts-routing.module";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
    declarations: [
        PostsComponent,
        NavComponent
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
