import { Component, OnInit } from '@angular/core';
import {AccountManagerService} from "../auth/account-manager.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {


  constructor(private accountManager:AccountManagerService) { }

  accountManagerLoggedIn():Boolean {
    return this.accountManager.loggedIn;
  }

  ngOnInit() {
  }

  signOut(){
    console.log(this.accountManager.loggedIn)
    this.accountManager.signOut();
  }

}
