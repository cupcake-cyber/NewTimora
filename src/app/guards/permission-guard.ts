import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { SessionService } from '../services/user-session/user-session';
import { ROUTE_PERMISSIONS } from '../config/route-permissions';
import { map, take } from 'rxjs/operators';

export const permissionGuard: CanActivateChildFn = (route, state) => {

  const sessionService = inject(SessionService);
  const router = inject(Router);

  return sessionService.user$.pipe(
    take(1),
    map(session => {

      if (!session) {
        return router.createUrlTree(['/login']);
      }

      const url = state.url.split('?')[0].split(';')[0];

      const allowed = ROUTE_PERMISSIONS[url];

      if (!allowed) {
        return true;
      }

      if (allowed.includes(session.mode)) {
        return true;
      }

      return router.createUrlTree(['/app/dashboard']);
    })
  );
};