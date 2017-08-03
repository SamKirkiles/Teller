import { Component, OnInit } from '@angular/core';
import {MessengerAuthorizationService} from "../messenger-authorization.service";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-authorize-messenger',
    templateUrl: './authorize-messenger.component.html',
    styleUrls: ['./authorize-messenger.component.css'],
    providers: []
}   )
export class AuthorizeMessengerComponent implements OnInit {

    constructor(private messengerService: MessengerAuthorizationService, private route: ActivatedRoute) {
        this.messengerService.authenticationRedirect = true;

        let linkingToken = this.route.snapshot.queryParams.account_linking_token;
        let redirectURL = this.route.snapshot.queryParams.redirect_uri;

        console.log(linkingToken);
    }

    ngOnInit() {

    }

}