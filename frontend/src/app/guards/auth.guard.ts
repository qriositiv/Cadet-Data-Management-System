import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Makes this guard available application-wide
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  /**
   * Determines if the route can be activated based on authentication status.
   * - Checks if the `access_token` exists in localStorage.
   * - Redirects unauthenticated users to the login page.
   */
  canActivate(
    route: ActivatedRouteSnapshot, // Contains information about the current route
    state: RouterStateSnapshot // Contains information about the router's state
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Check if the user is authenticated by verifying the presence of an access token
    const isAuthenticated = !!localStorage.getItem('access_token');

    if (!isAuthenticated) {
      // Redirect to the login page if not authenticated
      this.router.navigate(['/login']);
      return false;
    }

    // Allow route activation for authenticated users
    return true;
  }
}
