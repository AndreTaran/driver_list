import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  currentUser!: any;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(res => this.currentUser = res);
    console.log(this.currentUser, 'curr user')
  }

  logout() {
    this.authService.logout();
  }

  getUserName(): string | null {
    return localStorage.getItem('name');
  }

  isUserAdmin(): boolean {
    const userRole = localStorage.getItem('role');
    return userRole === 'admin';
  }

}
