import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonModule, InputTextModule, NgIf, ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loggedIn : boolean = false;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {
    this.authService.loggedIn$.subscribe((value) => {
      this.loggedIn = value;
    })
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      this.authService.login({ email, password }).subscribe({
        next: (response) => {
          this.authService.storeToken(response.token);
          this.loggedIn = true;
          this.authService.isLoggedIn = true;
          this.authService.getUserData();
        },
        error: (err) => {
          alert('Login error: ' + err.error.message);
        }
      });
    } else {
      alert('Form is not valid');
    }
  }

  goToRoute() {
    this.authService.getRoute();
  }
}
