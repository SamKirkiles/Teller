import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AccountManagerService} from "../../auth/account-manager.service";
import {Http, Headers} from '@angular/http';
import {environment} from '../../../environments/environment';

declare var Plaid: any;


@Component({
  selector: 'app-link-account',
  templateUrl: './link-account.component.html',
  styleUrls: ['./link-account.component.css']
})

export class LinkAccountComponent implements OnInit {

    linked: Boolean = false;

    private headers = new Headers({'Content-Type': 'application/json'});


    constructor(private router: Router, private accountManager: AccountManagerService, private http: Http) {

    }



  ngOnInit() {

  }

    openHandler() {

        const linkhandler = Plaid.create({
            env: 'sandbox',
            clientName: 'Plaid Sandbox',
            // Replace '<PUBLIC_KEY>' with your own `public_key`
            key: '7c3957b1e3d87ff6d43559a3aebc04',
            product: ['auth'],
            onSuccess: (public_token, metadata) => {
                // Send the public_token to your app server here.
                // The metadata object contains info about the
                // institution the user selected and the
                // account_id, if selectAccount is enabled.

                const token = localStorage.getItem('session');

                this.accountManager.getCurrentUser(token).then(user => {
                    console.log(user.userID);
                    let publicToken = public_token
                    // make an http call to add the new plaid token to the user to signify that we have linked a bank account
                    // we will also have to link an account with facebook so we can identify the user from the frontend

                    this.http.post(environment.apiUrl + '/api/plaidID', JSON.stringify({
                        'plaid_ID' : publicToken,
                        'user': user.userID
                    }), {headers: this.headers}).toPromise().then(res => {
                        // we have sent request to Teller api to update the user and now have the response
                        const body = JSON.parse(res['_body']);
                        console.log(body);
                        this.linked = true;
                    });
                });


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

    backToAccount(){
        this.router.navigate(['/account']);
    }
}
