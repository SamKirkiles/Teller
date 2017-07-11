import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";


declare var Plaid: any;


@Component({
  selector: 'app-link-account',
  templateUrl: './link-account.component.html',
  styleUrls: ['./link-account.component.css']
})

export class LinkAccountComponent implements OnInit {

    constructor(private router: Router) {

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
                console.log(public_token)
                this.router.navigate(['/account']);


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
