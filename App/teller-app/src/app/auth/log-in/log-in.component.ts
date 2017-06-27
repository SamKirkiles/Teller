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

  email:String = '';
  password:String = '';

  loginForm = new FormGroup({
    email: new FormControl('',Validators.email),
    password: new FormControl('',Validators.minLength(8))
  });

  constructor(private accountManager: AccountManagerService, private router: Router) { }

  signin(){
    this.signInError = false;


    if (this.loginForm.valid === true){


      this.accountManager.signIn(this.email,this.password)
        .then(response =>{

          let body = JSON.parse(response._body);

          if (body.payload.success === true){
            this.router.navigate(['/']);
            document.cookie = 'userToken= ' + body.payload.token;
          }else{
            this.signInError = true;
          }
      })
        .catch(error=>{
          this.signInError = true;
        })
    }else{
      console.error("Error signing in");

      this.signInError = true;
    }
  }

  ngOnInit() {
  }

}
