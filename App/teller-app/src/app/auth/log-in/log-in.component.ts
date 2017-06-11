import { Component, OnInit } from '@angular/core';
import {AccountManagerService} from "../../account-manager.service";
import {FormGroup, FormControl, Validators} from '@angular/forms';
import 'rxjs';

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

  constructor(private accountManager: AccountManagerService) { }

  signin(){
    this.signInError = false;


    if (this.loginForm.valid === true){
      this.accountManager.signIn(this.email,this.password)
        .then(response => console.log(response))
        .catch(error=>{
          this.signInError = true;
        })
    }else{
      this.signInError = true;
    }
  }

  ngOnInit() {
  }

}
