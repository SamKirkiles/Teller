import { Component, OnInit } from '@angular/core';
import {AccountManagerService} from "../auth/account-manager.service";
import {User} from "../auth/user.model";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(private accountManager: AccountManagerService) { }

  ngOnInit() {
  }

  getUser():User{
    if (this.accountManager.loggedIn){
      return this.accountManager.currentUser;
    }else{
      return null;
    }

  }

}
