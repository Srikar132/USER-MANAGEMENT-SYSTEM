import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): Observable<boolean> {
    return this.authService.getUserProfile().pipe(
      map(user => {
        if (user && user.role === 'admin') {
          this.router.navigate(['/dashboard']);
          return true;
        } else {
          this.router.navigate(['/profile']);
          return false;
        }
      }),
      catchError(err => {
        // Handle the error, e.g., navigate to login or show an error message
        console.error('Error checking user profile', err);
        this.router.navigate(['/login']); // or any other route
        return of(false);
      })
    );
  }
}
