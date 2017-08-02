import { Component, OnInit } from '@angular/core';
import {MessengerAuthorizationService} from "../messenger-authorization.service";

@Component({
    selector: 'app-authorize-messenger',
    templateUrl: './authorize-messenger.component.html',
    styleUrls: ['./authorize-messenger.component.css'],
    providers: [MessengerAuthorizationService]
}   )
export class AuthorizeMessengerComponent implements OnInit {

    constructor(private messengerService: MessengerAuthorizationService) {

    }

    ngOnInit() {

    }

}