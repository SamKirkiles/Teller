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

  constructor(private accountManager: AccountManagerService, private router: Router) { }

  edit = false;

  ngOnInit() {
    if (!this.accountManager.loggedIn){
      this.router.navigate(['/login']);
    }
  }

  getUser():User{
    if (this.accountManager.loggedIn){
      return this.accountManager.currentUser;
    }else{
      return null;
    }

  }

  editPressed(){
    this.edit = !this.edit;
  }

}
