import {Component, Input, OnInit} from '@angular/core';
import {AccountManagerService} from '../account-manager.service';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import 'rxjs';
import {Router, RouterModule} from '@angular/router';
import {MessengerAuthorizationService} from '../messenger-authorization.service';
import {Headers, Http} from '@angular/http';
import {environment} from '../../../environments/environment';


@Component({
    selector: 'app-log-in',
    templateUrl: './log-in.component.html',
    styleUrls: ['./log-in.component.css'],
    providers: []
})
export class LogInComponent implements OnInit {

    @Input() authorize: boolean = false;

    signInError = false;
    signInErrorMessage = 'Invalid account. Please check your email/password combo.';

    verifyError = false;

    email:string = '';
    password:string = '';

    private headers = new Headers({'Content-Type': 'application/json'});


    loginForm = new FormGroup({
    email: new FormControl('', Validators.email),
    password: new FormControl('', Validators.minLength(8))
  });

  constructor(private accountManager: AccountManagerService, private router: Router,
              private messengerAuth: MessengerAuthorizationService, private http: Http) { }

  signin() {

      this.signInError = false;


    if (this.loginForm.valid === true){

      this.accountManager.signIn(this.email, this.password)
        .then(response => {
            console.log('We are signing in');


            const body = JSON.parse(response._body);

          if (body.payload.success === true){
            if (this.messengerAuth.authenticationRedirect.redirect === true) {
                // else we need to get the variables form the auth manager and redirect the u\

                this.http.post(environment.apiUrl + '/api/authorize', JSON.stringify({
                    accountLinkingToken: this.messengerAuth.authenticationRedirect.token,
                    redirectURL: this.messengerAuth.authenticationRedirect.url,
                    userID: null
                }), {headers: this.headers}).toPromise().then(res => {
                    const body = JSON.parse(res['_body']);
                    console.log(body.payload);
                    console.log(this.messengerAuth.authenticationRedirect.url + '&account_linking_token='
                        + body.payload.authenticationToken);
                    window.location.href = this.messengerAuth.authenticationRedirect.url + '&authorization_code='
                        + body.payload.authenticationToken;
                });
            }else {
                this.router.navigate(['/']);
            }


          }else if (body.payload.success === false && body.error.errorCode === 'NOT_VERIFIED') {
              this.signInError = false;
              this.verifyError = true;
          }else{
              this.signInError = true;
          }
      })
        .catch(error => {
          this.signInError = true;
        });
    }else {
      console.error('Error signing in');

      this.signInError = true;
    }
  }

  resendVerification() {
      this.router.navigate(['/resendconfirmation']);
  }

  resetPassword() {
      this.router.navigate(['/resetpassword']);
  }

  ngOnInit() {
      console.log(this.authorize);
  }

  signUpRedirect() {
      this.router.navigate(['/signup']);
  }

}
