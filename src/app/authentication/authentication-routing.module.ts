import {NgModule} from '@angular/core';
import {AuthenticationComponent} from './authentication.component';
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {NoAuthGuard} from "../shared/guard/no-auth.guard";

const routes: Routes = [
    {
        path: '',
        component: AuthenticationComponent,
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            },
            {
                path: 'login',
                component: LoginComponent,
                canActivate: [NoAuthGuard]
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
export class AuthenticationRoutingModule {
}
