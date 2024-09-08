
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserManagingService {
  users : any
  baseURL : string = 'http://localhost:8000/api'
  constructor(private  http : HttpClient , private authService : AuthService) { }

  getUsers() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(`${this.baseURL}/admin/users`, { headers });
  }

  deleteUser(id : any) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.delete(`${this.baseURL}/admin/users/${id}`, { headers })
  }

  updateUser(id : any,newData : any) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.put(`${this.baseURL}/admin/users/${id}`, newData, { headers })
  }

  getUserById(id : any) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(`${this.baseURL}/admin/users/${id}`, { headers })
  }

}
