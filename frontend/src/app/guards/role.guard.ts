import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IntendantService } from '../services/intendant.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private intendantService: IntendantService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve) => {
      this.intendantService.getUserRole().subscribe(
        (response: any) => {
          const requiredRole = route.data['role']; // Role defined in route data
          if (response.role === requiredRole) {
            resolve(true);
          } else {
            console.error('Access denied - User does not have the required role');
            this.router.navigate(['/']); // Redirect to home or another route
            resolve(false);
          }
        },
        (error) => {
          console.error('Error fetching user role:', error);
          this.router.navigate(['/login']); // Redirect to login on error
          resolve(false);
        }
      );
    });
  }
}
