import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsComponent} from './settings.component';
import {AccountComponent} from './account/account.component';
import {TweaksComponent} from './tweaks/tweaks.component';
import {SettingsRoutingModule} from "./settings-routing.module";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {SharedModule} from "../shared/shared.module";


@NgModule({
    declarations: [
        SettingsComponent,
        AccountComponent,
        TweaksComponent
    ],
    imports: [
        CommonModule,
        SettingsRoutingModule,
        FontAwesomeModule,
        SharedModule
    ]
})
export class SettingsModule {
}
