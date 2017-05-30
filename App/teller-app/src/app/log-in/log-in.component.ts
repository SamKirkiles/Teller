import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

  signInError = false;

  constructor() { }

  signin(){
    this.signInError = !this.signInError;
  }

  ngOnInit() {
  }

}
