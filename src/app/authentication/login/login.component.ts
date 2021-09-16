import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  signIn(): void {
    this.router.navigate(['/']);
  }

  signUp(): void {
    this.router.navigate(['/']);
  }

}
