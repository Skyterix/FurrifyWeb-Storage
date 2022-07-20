import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../shared/guard/auth.guard";
import {ArtistsComponent} from "./artists.component";
import {ArtistViewComponent} from "./artist-view/artist-view.component";

const routes: Routes = [
    {
        path: '',
        component: ArtistsComponent,
        children: [
            {
                path: '',
                redirectTo: '/',
                pathMatch: 'full',
            },
            {
                path: ':artistId',
                pathMatch: 'full',
                component: ArtistViewComponent,
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
export class ArtistsRoutingModule {
}
