import { Component, OnInit } from '@angular/core';
import {AccountManagerService} from "../account-manager.service";
import {FormGroup, FormControl, Validators} from '@angular/forms';
import 'rxjs';
import {Router, RouterModule} from "@angular/router";

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css'],
  providers: []
})
export class LogInComponent implements OnInit {

  signInError = false;
  signInErrorMessage = 'Invalid account. Please check your email/password combo.';

  verifyError = false;

  email:String = '';
  password:String = '';

  loginForm = new FormGroup({
    email: new FormControl('',Validators.email),
    password: new FormControl('',Validators.minLength(8))
  });

  constructor(private accountManager: AccountManagerService, private router: Router) { }

  signin() {

      this.signInError = false;


    if (this.loginForm.valid === true){

      this.accountManager.signIn(this.email, this.password)
        .then(response => {
            console.log('We are signing in');


            const body = JSON.parse(response._body);

          if (body.payload.success === true){
            this.router.navigate(['/']);
          }else if (body.payload.success === false && body.error.errorCode === 'NOT_VERIFIED') {
              this.signInError = false;
              this.verifyError = true;
          }else{
              this.signInError = true;
          }
      })
        .catch(error => {
          this.signInError = true;
        });
    }else {
      console.error('Error signing in');

      this.signInError = true;
    }
  }

  resendVerification(){
      this.router.navigate(['/resendconfirmation']);
  }

  resetPassword(){
      this.router.navigate(['/resetpassword']);
  }

  ngOnInit() {
  }

}
