import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseURL: string = 'https://usm-backend.onrender.com/api';
  tokenKey: string = 'authToken';
  isLoggedIn : boolean = false;
  userData : any = null ;

  private userDataSubject = new BehaviorSubject<any>(null);
  public userData$ = this.userDataSubject.asObservable();
  private logInSuubject = new BehaviorSubject<boolean>(this.isTokenPresent());
  public loggedIn$ = this.logInSuubject.asObservable();
  constructor(private http: HttpClient, private router: Router) {
    this.initializeLoginStatus();
  }

  isTokenPresent():boolean {
    let token = this.getToken();
    return !!token;
  }

  private initializeLoginStatus(): void {
    if (this.isTokenPresent()) {
      this.getUserProfile().subscribe({
        next: (profile) => {
          this.userData = profile;
          this.userDataSubject.next(profile);
          this.logInSuubject.next(true);
        },
        error: (err) => {
          console.error('Error fetching user profile:', err);
          this.logInSuubject.next(false);
        }
      });
    } else {
      this.logInSuubject.next(false);
    }
  }


  getToken(): string | null {
    if (typeof window !== 'undefined' && localStorage) {

      return localStorage.getItem(this.tokenKey);
    } else {
      console.warn('localStorage is not available.');
      return null;
    }
  }

  storeToken(token: string): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem(this.tokenKey, token);
      this.logInSuubject.next(true);
    } else {
      console.warn('localStorage is not available.');
    }
  }

  removeToken(): void {
    if (typeof window !== 'undefined' && localStorage) {
      this.logInSuubject.next(false);
      localStorage.removeItem(this.tokenKey);
    } else {
      console.warn('localStorage is not available.');
    }
  }


  getUserData() : void {
    this.getUserProfile().subscribe({
      next : response => {
        this.userData = response;
        this.userDataSubject.next(response);
      },
      error : err => {
        console.log('errror fetching data');
      }
    })
  }



  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseURL}/users/register`, userData);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseURL}/users/login`, credentials);
  }

  updateUser(id : any,newData : any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`
    });
    return this.http.put(`${this.baseURL}/users/update/${id}`, newData,{headers});
  }

  logout() {
    this.removeToken();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  getRoute(): void {
    this.getUserProfile().subscribe({
      next: (profile) => {
        if (profile.security.role === 'user') {
          this.router.navigate(['/profile']);
        } else if (profile.security.role === 'admin') {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        console.error('Error fetching user profile', err);
        this.router.navigate(['/login']);
      }
    });
  }


  getUserProfile(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`
    });
    return this.http.get(`${this.baseURL}/users/profile`, { headers });
  }
}
