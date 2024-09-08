import { Router, RouterLink } from '@angular/router'
import { Component, OnInit , HostListener } from '@angular/core';
import { UserManagingService } from '../user-managing.service';
import { NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { FormBuilder , FormGroup , ReactiveFormsModule , Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import {format} from 'date-fns'
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor , NgSwitch , NgSwitchCase,NgIf ,RouterLink,NgClass,ReactiveFormsModule,InputTextModule,ButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  users : any ;
  index : number | null = -1;
  selectedUser : any;
  isLoading : boolean = false
  deleteController = {
    show : false,
    user : null
  }
  section : string = 'users';
  constructor(private userMngService : UserManagingService,private fb : FormBuilder,private router : Router) {

  }
  ngOnInit() : void {
      this.isLoading = false;
      this.userMngService.getUsers().subscribe({
        next : response => {
          this.users = response;
          console.log(this.users)
          this.isLoading = false;
        },
        error : err => {
          console.log(err);
        }
      })
  }


  onDeleteUser() {
    this.isLoading = true;

    let user : any = this.deleteController.user ;

    if(!user) {
      alert('unable to delete !')
      return ;
    }

    this.userMngService.deleteUser(user._id).subscribe({
      next : response => {
        this.isLoading = false;

        this.cancelDelete();
        this.userMngService.getUsers().subscribe({
          next : response => {
            this.users = response;
          },
          error : err => {
            console.log(err);
          }
        })
      },
      error : err => {
        console.log(err);
      }
    })
  }

  editUser(id : any) {
    this.router.navigate(['/editform',id]);
  }

  setSection(type : string) {
    this.section = type;
  }

  getDate(date: any): string {
    try {
      let newDate = new Date(date);
      console.log('Parsed date:', newDate);
      if (isNaN(newDate.getTime())) {
        return 'Invalid date';
      }
      let formattedDate = format(newDate, "MMMM d , yyyy");
      return formattedDate;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Error';
    }
  }


  setIndex(index : number) {
    this.index = index;
  }

  setDeleteController(i : number) {
    this.deleteController.user = this.users[i];
    this.deleteController.show = true;
  }

  cancelDelete() {
    this.deleteController.show = false;
    this.deleteController.user = null;
  }

  @HostListener('document:click',['$event'])
  onClick(event : Event) {
    if(!(event.target as HTMLElement).closest('td')) {
      this.index = null;
    }
  }
}
