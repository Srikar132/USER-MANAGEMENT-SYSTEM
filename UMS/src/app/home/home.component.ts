import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgIf } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink , NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit , OnDestroy {
  isLoggedIn: boolean = false;
  userData: any = null;
  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log("Navbar initialized");

    this.authService.loggedIn$
      .pipe(takeUntil(this.destroy$))
      .subscribe((vaue: boolean) => {
        this.isLoggedIn = vaue;
        this.cd.detectChanges();

        if (this.isLoggedIn) {
          console.log("User is logged in");
          this.fetchUserData();
        } else {
          this.userData = null;
        }
      });
  }

  fetchUserData(): void {
    this.authService.userData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((userData) => {
        this.userData = userData;
        console.log("User data updated:", this.userData);
        this.cd.detectChanges();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
