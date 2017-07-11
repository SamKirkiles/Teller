import { Component, OnInit } from '@angular/core';
import {AccountManagerService} from '../../auth/account-manager.service';
import {User} from '../../auth/user.model';

declare var Plaid: any;

@Component({
  selector: 'app-account-view',
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.css']
})
export class AccountViewComponent implements OnInit {

  currentUser: User;

  constructor(private accountManager: AccountManagerService) {
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


    openHandler() {
      const linkhandler = Plaid.create({
          env: 'sandbox',
          clientName: 'Plaid Sandbox',
          // Replace '<PUBLIC_KEY>' with your own `public_key`
          key: '7c3957b1e3d87ff6d43559a3aebc04',
          product: ['auth'],
          onSuccess: function(public_token, metadata) {
              // Send the public_token to your app server here.
              // The metadata object contains info about the
              // institution the user selected and the
              // account_id, if selectAccount is enabled.
          },
          onExit: function(err, metadata) {
              // The user exited the Link flow.
              if (err != null) {
                  // The user encountered a Plaid API error
                  // prior to exiting.
              }
              // metadata contains information about the
              // institution that the user selected and the
              // most recent API request IDs. Storing this
              // information can be helpful for support.
          }
      });

      linkhandler.open();

      console.log('clicked');
  }


  }
