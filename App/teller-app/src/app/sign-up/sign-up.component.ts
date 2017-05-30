import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormBuilder, Validators} from "@angular/forms";
import {passwordMatchValidator} from "../shared/inputMatch.validator";


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})



export class SignUpComponent implements OnInit {

  signUpForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    pass: new FormControl('', [Validators.required, Validators.minLength(8)]),
    passcheck: new FormControl('', [Validators.required, Validators.minLength(8)])
  }, passwordMatchValidator);

  constructor(private fb: FormBuilder) {
  }


  formSubmit(){
    console.log(this.signUpForm)
  }


  ngOnInit() {
  }


}
