import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup , ReactiveFormsModule, Validators } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { Button, ButtonModule } from "primeng/button";
import { UserManagingService } from "../../user-managing.service";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { NgClass, NgIf } from "@angular/common";
import { Router } from "@angular/router";
@Component({
  standalone : true,
  selector:'app-userform',
  imports: [NgClass,ReactiveFormsModule,NgIf,InputTextModule,ButtonModule,RouterLink],
  templateUrl : './userform.component.html',
})
export class UserformComponent implements OnInit {
  isLoading : boolean = false;
  userForm: FormGroup;
  userId : any  | null;
  user : any ;
  constructor(private fb: FormBuilder, private userMngService: UserManagingService, private route: ActivatedRoute,private router : Router) {
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
    this.route.paramMap.subscribe(param => {
      const id = param.get('id');
      this.userId = id;
      if (id) {
        this.userMngService.getUserById(id).subscribe({
          next: response => {
            this.user = response;
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
          error: err => {
            console.error('Error fetching user:', err);
          }
        });
      }
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
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
      this.userMngService.updateUser(this.userId,formData).subscribe({
        next : response => {
          alert("details submited")
          this.router.navigate(['/dashboard']);
        },
        error : err => {
          console.log(err);
        }
      })
    }else {
      alert("form is invalid");
    }
  }
}
