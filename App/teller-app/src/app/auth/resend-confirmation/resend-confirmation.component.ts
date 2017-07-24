import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AccountManagerService} from "../account-manager.service";

@Component({
  selector: 'app-resend-confirmation',
  templateUrl: './resend-confirmation.component.html',
  styleUrls: ['./resend-confirmation.component.css']
})
export class ResendConfirmationComponent implements OnInit {

    emailSent = false;
    emailError = false;

    emailForm = new FormGroup({
        emailControl: new FormControl('', Validators.email)
    });

  constructor(private accountManager: AccountManagerService) { }

  ngOnInit() {
  }

  submitForm() {
      if (this.emailForm.valid === true) {
          this.accountManager.resendAccountVerification(this.emailForm.value.emailControl).then(res => {
              const body = JSON.parse(res._body);
              const confirm:boolean = body.payload.success;
              if (confirm === true) {
                  this.emailSent = true;
                  this.emailError = false;
             }else {
                  this.emailSent = false;
                  this.emailError = true;
              }
          });
      }else{
          this.emailError = true;
      }
  }

}
