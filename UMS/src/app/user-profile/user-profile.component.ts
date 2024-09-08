import { join } from 'node:path';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormBuilder , FormGroup , Validators , ReactiveFormsModule } from '@angular/forms';
import { timeStamp } from 'console';


@Component({
  selector: 'app-user-profile',
  standalone : true ,
  imports : [NgClass,NgIf,NgFor,ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userForm: FormGroup;
  isLoading : boolean = false;
  user: any;
  error: string | null = null;
  isEditing: boolean = false;
  constructor(private fb: FormBuilder ,private authService : AuthService) {
    // Initialize the form
    this.userForm = this.fb.group({
      first_name: [''],
      last_name: [''],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: [''],
      gender: [''],
      job_title: [''],
      company: [''],
      skills: [''],
      bio: [''],
      website: [''],
      social_links: [''],
    });
  }
  ngOnInit(): void {

    this.authService.getUserProfile().subscribe({
      next: (profile) => {
        this.user = profile;
        this.userForm.patchValue({
          first_name: this.user.basic_info.first_name,
          last_name: this.user.basic_info.last_name,
          username: this.user.basic_info.username,
          email: this.user.basic_info.email,
          phone_number: this.user.basic_info.phone_number,
          gender: this.user.basic_info.gender,
          job_title: this.user.professional_info.job_title,
          company: this.user.professional_info.company,
          skills: this.user.professional_info.skills,
          bio: this.user.social.bio,
          website: this.user.social.website,
          social_links: this.user?.social?.socila_links?.join(','),
        });
      },
      error: (err) => {
        console.error('Error fetching user profile', err);
        this.error = 'Failed to load profile';
      }
    });
  }



  onSubmit() {
    if(this.userForm.valid) {
      this.isLoading = true;
      let formData = this.userForm.value;

      if(typeof formData.skills === "string") {
        formData.skills = formData.skills.split(',').map((skill : any) => skill.trim());
        formData.skills = [];
      }else {
        console.warn("formData.skills is not string")
      }
      if(typeof formData.social_links === "string") {
        formData.social_links = formData.socila_links.split(',').map((skill : any) => skill.trim());
      }else {
        console.warn("formData.social_links is not string")
        formData.social_links = [];
      }

      this.authService.updateUser(this.user._id , formData).subscribe({
        next : (response : any) => {
          console.log(response);
          alert(response.message);
          this.authService.getUserProfile().subscribe({
            next: (profile) => {
              console.log(profile);
              this.user = profile;
              this.userForm.patchValue(this.user);
              this.isEditing = !this.isEditing;
            },
            error: (err) => {
              console.error('Error fetching user profile', err);
              this.error = 'Failed to load profile';
            }
          });
        },
        error : err => {
          alert("error : "+err);
        }
      })
    }
  }



}
