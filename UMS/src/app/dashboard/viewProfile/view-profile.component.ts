import { Subject } from 'rxjs';
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup , ReactiveFormsModule, Validators } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { Button, ButtonModule } from "primeng/button";
import { UserManagingService } from "../../user-managing.service";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { NgClass, NgFor, NgIf } from "@angular/common";
import { Router } from "@angular/router";
@Component({
  standalone : true,
  selector:'app-view-profile',
  imports: [NgClass,ReactiveFormsModule,NgIf,InputTextModule,ButtonModule,RouterLink,NgFor],
  templateUrl : './view-profile.component.html'
})


export class ViewProfileComponnet implements OnInit {
  user : any ;
  constructor(private route : ActivatedRoute,private userMngService : UserManagingService) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      const id = param.get('id');
      if (id) {
        this.userMngService.getUserById(id).subscribe({
          next: response => {
            this.user = response;
          },
          error: err => {
            console.error('Error fetching user:', err);
          }
        });
      }
    });
  }

}
