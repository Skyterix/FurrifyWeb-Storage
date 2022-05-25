import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from "@angular/router";

const appRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'posts'
    },
    {
        path: 'posts',
        loadChildren: () => import('./posts/posts.module').then(m => m.PostsModule)
    },
    {
        path: 'artists',
        loadChildren: () => import('./artists/artists.module').then(m => m.ArtistsModule)
    },
    {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
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
