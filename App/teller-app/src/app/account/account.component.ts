import { Component, OnInit } from '@angular/core';
import {AccountManagerService} from "../auth/account-manager.service";
import {User} from "../auth/user.model";
import {Router, RouterModule} from "@angular/router";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  edit = false;

  currentUser: User;

  constructor(private accountManager: AccountManagerService, private router: Router) {
    this.getUser();
  }

  ngOnInit() {
  }

  getUser() {
      this.accountManager.getCurrentUser().then( user => {
        this.currentUser = user;
      });
  }

  editPressed() {
    this.edit = !this.edit;
  }

}
