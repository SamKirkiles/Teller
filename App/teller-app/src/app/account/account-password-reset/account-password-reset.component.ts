import { Component, OnInit } from '@angular/core';
import {FormGroup, Validators, FormControl} from "@angular/forms";

@Component({
  selector: 'app-account-password-reset',
  templateUrl: './account-password-reset.component.html',
  styleUrls: ['./account-password-reset.component.css']
})
export class AccountPasswordResetComponent implements OnInit {

  resetPasswordForm = new FormGroup({
    email: new FormControl('', Validators.email),
  });

  sent = false;


  constructor() { }

  submitPressed(){
    if (this.resetPasswordForm.valid){
      // send api request to send verification email to user
      this.sent = !this.sent;
    }else {
    }
  }

  ngOnInit() {
  }

}
