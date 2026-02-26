import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from '@angular/router';
import { User } from '../models/user';
import { Authentication } from '../services/authentication';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  public formError: string = '';
  submitted = false;
  credentials = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  }

  constructor(
    private router: Router,
    private authenticationService: Authentication
    ) { }

  ngOnInit(): void {}

  public onSignupSubmit(): void {
    this.formError = '';

    if (!this.credentials.name || !this.credentials.email ||
        !this.credentials.password || !this.credentials.confirmPassword) {
      this.formError = 'All fields are required, please try again';
      return;
    }

    if (this.credentials.password !== this.credentials.confirmPassword) {
      this.formError = 'Passwords do not match';
      return;
    }

    this.doSignup();
  }

  private doSignup(): void {
    let newUser = {
      name: this.credentials.name,
      email: this.credentials.email
    } as User;

    this.authenticationService.register(newUser,
      this.credentials.password);

    // Wait briefly for the async registration to complete, then redirect
    var timer = setTimeout(() => {
      if (this.authenticationService.isLoggedIn()) {
        const user = this.authenticationService.getCurrentUser();
        if (user.role && user.role !== 'admin') {
          window.location.href = 'http://localhost:3000';
        } else {
          this.router.navigate(['']);
        }
      } else {
        this.formError = 'Registration failed. The email may already be in use.';
      }
    }, 3000);
  }
}
