import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from "@angular/router";

const appRoutes: Routes = [
    {
        path: '',
        loadChildren: () => import('./posts/posts.module').then(m => m.PostsModule)
    },
    {
        path: 'auth',
        loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)
    }
];

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {
}
