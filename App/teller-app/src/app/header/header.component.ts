import { Component, OnInit } from '@angular/core';
import {AccountManagerService} from "../auth/account-manager.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    loggedIn = false;


  constructor(private accountManager: AccountManagerService) {
      console.log("not here");
  }



  ngOnInit() {
      this.accountManager.isLoggedIn().then(res => {
         this.loggedIn = res;
      });

      this.accountManager.login.subscribe((value) => {
         this.loggedIn = value;
      });
  }

  signOut() {
    this.accountManager.signOut();
  }

}
