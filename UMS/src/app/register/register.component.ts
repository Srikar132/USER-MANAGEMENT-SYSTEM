import { AuthService } from './../auth.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators , ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { NgIf } from '@angular/common';
import { Router ,RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, NgIf , RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder , private authService : AuthService, private http: HttpClient, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone_number: ['', Validators.required],
      gender: ['', Validators.required],
      job_title: ['', Validators.required],
      company: ['', Validators.required],
      skills: [''],
      bio: ['', Validators.required],
      website: [''],
      social_links: ['']
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      formData.skills = formData.skills.split(',').map((skill: string) => skill.trim())
      formData.social_links = formData.social_links.split(',').map((link: string) => link.trim())
      console.log(formData);
      this.authService.register(formData)
        .subscribe({
          next: (response) => {
            alert("Registration succussfull");
            this.router.navigate(['/login']);
          },
          error: (err) => {
            console.error('Registration error', err);
          }
        });
    } else {
      console.error('Form is invalid');
    }
  }
}
