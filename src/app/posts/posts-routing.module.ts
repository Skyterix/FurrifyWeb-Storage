import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {PostsComponent} from "./posts.component";
import {AuthGuard} from "../shared/guard/auth.guard";
import {PostListComponent} from "./post-list/post-list.component";
import {PostViewComponent} from "./post-view/post-view.component";

const routes: Routes = [
    {
        path: '',
        component: PostsComponent,
        children: [
            {
                path: ':postId',
                component: PostViewComponent,
                canActivate: [AuthGuard]
            },
            {
                path: '',
                pathMatch: 'exact',
                component: PostListComponent,
                canActivate: [AuthGuard]
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class PostsRoutingModule {
}
