import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgIf } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIf,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLogined: boolean = false;
  userData: any = null;
  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log("Navbar initialized");

    // Subscribe to the login status observable
    this.authService.loggedIn$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn: boolean) => {
        this.isLogined = isLoggedIn;
        this.cd.detectChanges(); // Ensure change detection is triggered

        if (this.isLogined) {
          console.log("User is logged in");
          this.fetchUserData(); // Fetch user profile if logged in
        } else {
          this.userData = null; // Reset user data if not logged in
        }
      });
  }

  fetchUserData(): void {
    this.authService.userData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((userData) => {
        this.userData = userData;
        console.log("User data updated:", this.userData);
        this.cd.detectChanges(); // Ensure change detection is triggered
      });
  }

  logOut() {
    this.authService.logout();
    this.isLogined = false;
    this.userData = null; // Reset user data on logout
    this.cd.detectChanges(); // Trigger change detection manually
  }

  ngOnDestroy() {
    // Complete the observable to avoid memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }
}
