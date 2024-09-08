import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';
import { NavbarComponent } from './navbar/navbar.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers :[AuthService]
})
export class AppComponent implements OnInit {
  title = 'UMS';

  constructor(private  authService : AuthService ) {}
  ngOnInit(): void {
    
}
}
