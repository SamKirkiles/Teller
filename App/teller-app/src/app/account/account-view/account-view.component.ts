import { Component, OnInit } from '@angular/core';
import {AccountManagerService} from "../../auth/account-manager.service";
import {User} from "../../auth/user.model";

@Component({
  selector: 'app-account-view',
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.css']
})
export class AccountViewComponent implements OnInit {

  constructor(private accountManager: AccountManagerService) { }

  ngOnInit() {
  }

  getUser():User {
    if (this.accountManager.loggedIn) {
      return this.accountManager.currentUser;
    } else {
      return null;
    }
  }


  }
