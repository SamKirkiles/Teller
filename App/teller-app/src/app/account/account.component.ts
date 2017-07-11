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
    if (!this.accountManager.isLoggedIn()){
      console.log('We are not logged in');
      this.router.navigate(['/login']);
    }
  }

  getUser() {
    if (this.accountManager.isLoggedIn()) {
      this.accountManager.getCurrentUser(this.accountManager.token).then( user => {
        this.currentUser = user;
      });
    }else {
      this.currentUser = null;
    }

  }

  editPressed() {
    this.edit = !this.edit;
  }

}
