import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArtistsComponent} from './artists.component';
import {ArtistViewComponent} from './artist-view/artist-view.component';
import {ArtistsRoutingModule} from "./artists-routing.module";
import {PostsModule} from "../posts/posts.module";
import {SharedModule} from "../shared/shared.module";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";


@NgModule({
    declarations: [
        ArtistsComponent,
        ArtistViewComponent
    ],
    imports: [
        CommonModule,
        ArtistsRoutingModule,
        PostsModule,
        SharedModule,
        FontAwesomeModule
    ]
})
export class ArtistsModule {
}
