import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IntendantService } from '../services/intendant.service';

@Injectable({
  providedIn: 'root', // Makes this guard available throughout the application
})
export class RoleGuard implements CanActivate {
  constructor(private intendantService: IntendantService, private router: Router) {}

  /**
   * Determines if a route can be activated based on the user's role.
   * - Fetches the user's role from the backend using `IntendantService`.
   * - Compares the user's role with the role required for the route.
   * - Redirects to the appropriate page if the user does not have the required role.
   */
  canActivate(
    route: ActivatedRouteSnapshot, // Provides route-specific data
    state: RouterStateSnapshot // Represents the router's state
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve) => {
      // Fetch the user's role
      this.intendantService.getUserRole().subscribe(
        (response: any) => {
          const requiredRole = route.data['role']; // Retrieve the role specified in route data
          if (response.role === requiredRole) {
            resolve(true); // User has the required role, allow access
          } else {
            console.error('Access denied - User does not have the required role');
            this.router.navigate(['/']); // Redirect to the home page
            resolve(false); // Deny access
          }
        },
        (error) => {
          console.error('Error fetching user role:', error);
          this.router.navigate(['/login']); // Redirect to login on error
          resolve(false); // Deny access
        }
      );
    });
  }
}
