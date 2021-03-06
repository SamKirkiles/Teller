import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormBuilder, Validators} from "@angular/forms";
import {passwordMatchValidator} from "../../shared/inputMatch.validator";
import {AccountManagerService} from "../account-manager.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  providers: []
})



export class SignUpComponent implements OnInit {

    signInError = false;

  signUpForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    pass: new FormControl('', [Validators.required, Validators.minLength(8)]),
    passcheck: new FormControl('', [Validators.required, Validators.minLength(8)])
  }, passwordMatchValidator);

  constructor(private fb: FormBuilder, private accountManager: AccountManagerService, private router: Router) {
  }


  formSubmit() {
      console.log("We are trying to signup")

    if (this.signUpForm.valid === true) {
      this.accountManager.signUp(this.signUpForm.value.name, this.signUpForm.value.passcheck,this.signUpForm.value.email)
        .then(response => {
          console.log(response);

          const responseBody = JSON.parse(response._body);

          if (responseBody.error.errorCode === null){
            console.log('Successful signup.!');
            this.router.navigate(['/signup/confirm']);
            // now we need to email the user with a confirmation code
          }else if (responseBody.error.errorCode === 'ER_DUP_ENTRY') {
            console.log('We have a duplicate account!');
            this.signInError = true;
          }
        })
    }
  }


  ngOnInit() {
  }


}
