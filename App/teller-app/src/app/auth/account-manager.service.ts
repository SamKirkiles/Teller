import {Injectable, isDevMode, OnInit} from '@angular/core';
import {Headers, Http} from "@angular/http";
import 'rxjs';
import {User} from "./user.model";
import {Router} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class AccountManagerService {

  public currentUser: User = null;
  public token: string;

  public login: BehaviorSubject<boolean>;



  private headers = new Headers({'Content-Type': 'application/json'});


  constructor(private http: Http, private router: Router) {

      this.login = new BehaviorSubject(false);

      this.getCurrentUser().then(userResult => {
        if (!isNullOrUndefined(userResult)) {
          this.currentUser = userResult;
        }else {

        }
      });
  }

  isLoggedIn(): Promise<boolean> {
    const resultToken = localStorage.getItem('session');

    if (!isNullOrUndefined(resultToken)) {
        return this.verifyLogin(resultToken).then(res => {
            const body = JSON.parse(res['_body']);
            this.login.next(body.payload.success);
            return body.payload.success;
        });
    }else {

      return new Promise((resolve, reject) => {
          this.login.next(false);
          resolve(false);
      });
    }
  }

  verifyLogin(token) {
      return this.http.post(environment.apiUrl + '/api/verifylogin', JSON.stringify({
          'token': token
      }), {headers: this.headers}).toPromise();
  }

  signIn(email: String, password: String): Promise<any> {

    // return a new promise from an http post to signin that then gets the current user with the token that is returned

      console.log(environment.apiUrl);
      return this.http.post(environment.apiUrl + '/api/signin', JSON.stringify({
      'email' : email,
      'password': password
    }), {headers: this.headers}).toPromise().then(res => {

          console.log(res);

          const body = JSON.parse(res['_body']);

        if (body.payload.success === true){

          this.token = body.payload.token;

          localStorage.setItem('session', this.token);

          // call our getCurrentUser method which returns a promise and use the user created from that

          this.getCurrentUser().then(userResult => {
            if (!isNullOrUndefined(userResult)) {
              this.login.next(true);
              this.currentUser = userResult;
            }else {
              this.login.next(false);
              this.currentUser = null;
            }
          });
          // there was a problem signing in and we didnt even get the user
        }else {
            console.log('There was a problem signing in');
            this.login.next(false);
          this.token = null;
        }
      return res;
    });
  }

  signUp(fullname: String, password: String, email: String): Promise<any> {
      return this.http.post(environment.apiUrl + '/api/signup', JSON.stringify({
      'fullname': fullname,
      'password': password,
      'email': email
    }), {headers: this.headers})
      .toPromise();
  }

  verifyAccount(token: String): Promise<any> {
      return this.http.post(environment.apiUrl + '/api/verifyaccount', JSON.stringify({
          'token': token
      }), {headers: this.headers}).toPromise();
  }

  resendAccountVerification(email: String): Promise<any>{
    return this.http.post(environment.apiUrl + '/api/resendVerification', JSON.stringify({
        'email': email
    }), {headers: this.headers}).toPromise();
  }

  getCurrentUser(): Promise<User> {

      const token = localStorage.getItem('session');

      return this.http.post(environment.apiUrl + '/api/currentuser' , JSON.stringify({
        'token': token
      }), {headers: this.headers}).toPromise().then(res => {
        const body = JSON.parse(res['_body']);
        if (body.payload.success !== false) {
          this.currentUser = new User(body.payload.result.fullname, body.payload.result.email, body.payload.result.userID, body.payload.result.messengerID);
          return this.currentUser;
        }else {
          this.currentUser = null;
          return null;
        }
      });

  }

  signOut() {

    if (confirm('Are you sure you want to log out?')) {
      // Save it!
      this.login.next(false);
      localStorage.clear();

    } else {
      // Do nothing!
    }

  }

}
