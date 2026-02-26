import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from '@angular/router';
import { User } from '../models/user';
import { Authentication } from '../services/authentication';


@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  public formError: string = '';
  submitted = false;
  credentials = {
    email: '',
    password: ''
  }

  constructor(
    private router: Router,
    private authenticationService: Authentication
    ) { }

  ngOnInit(): void {}

  public onLoginSubmit(): void {
    this.formError = '';

    if (!this.credentials.email || !this.credentials.password) {
      this.formError = 'All fields are required, please try again';
    } else {
      this.doLogin();
    }
  }

  private doLogin(): void {
    let newUser = {
      name: '',
      email: this.credentials.email
    } as User;

    // console.log('LoginComponent::doLogin');
    // console.log(this.credentials);

    this.authenticationService.login(newUser,
      this.credentials.password);
    if(this.authenticationService.isLoggedIn())
    {
      const user = this.authenticationService.getCurrentUser();
      if(user.role && user.role !== 'admin') {
        window.location.href = 'http://localhost:3000';
      } else {
        this.router.navigate(['']);
      }
    } else {
      var timer = setTimeout(() => {
      if(this.authenticationService.isLoggedIn())
      {
        const user = this.authenticationService.getCurrentUser();
        if(user.role && user.role !== 'admin') {
          window.location.href = 'http://localhost:3000';
        } else {
          this.router.navigate(['']);
        }
      }},3000);
    }
  }
}
