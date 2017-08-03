import { Injectable } from '@angular/core';

@Injectable()
export class MessengerAuthorizationService {

    authenticationRedirect = {
        redirect: false,
        token: null,
        url: null
    };

    constructor() { }

}
