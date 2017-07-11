import { Component, OnInit } from '@angular/core';
import {AccountManagerService} from '../../auth/account-manager.service';
import {User} from '../../auth/user.model';
import {Router} from "@angular/router";

@Component({
  selector: 'app-account-view',
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.css']
})
export class AccountViewComponent implements OnInit {

  currentUser: User;

  constructor(private accountManager: AccountManagerService, private router: Router) {
    this.getUser();
  }

  ngOnInit() {
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

  linkAccountPressed(){
      this.router.navigate(['/linkaccount']);
  }

  }
