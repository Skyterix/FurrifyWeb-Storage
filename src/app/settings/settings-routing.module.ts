import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../shared/guard/auth.guard";
import {SettingsComponent} from "./settings.component";
import {AccountComponent} from "./account/account.component";
import {TweaksComponent} from "./tweaks/tweaks.component";

const routes: Routes = [
    {
        path: '',
        component: SettingsComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'tweaks'
            },
            {
                path: 'tweaks',
                component: TweaksComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'account',
                component: AccountComponent,
                canActivate: [AuthGuard]
            },
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
export class SettingsRoutingModule {
}
