import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {AuthGuardData, createAuthGuard} from 'keycloak-angular';
import {inject} from '@angular/core';

const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  _: RouterStateSnapshot,
  authData: AuthGuardData
): Promise<boolean | UrlTree> => {
  const { authenticated } = authData;

  if (!authenticated) {
    return true;
  }

  const router = inject(Router);
  return router.parseUrl('/auth');
};

export const NoAuthGuard = createAuthGuard<CanActivateFn>(isAccessAllowed);
