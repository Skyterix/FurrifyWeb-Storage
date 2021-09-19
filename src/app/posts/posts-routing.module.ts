import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {PostsComponent} from "./posts.component";
import {AuthGuard} from "../shared/guard/auth.guard";

const routes: Routes = [
    {
        path: '',
        component: PostsComponent,
        children: [
            {
                path: '',
                component: PostsComponent,
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
