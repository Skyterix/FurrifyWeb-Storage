import {AuthComponent} from './auth.component';
import {NoAuthGuard} from '../shared/guard/no-auth.guard';
import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    canActivate: [NoAuthGuard]
  }
];

@NgModule({
  declarations: [
    AuthComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  bootstrap: [
    AuthComponent
  ]
})
export class AuthRoutingModule {
}
