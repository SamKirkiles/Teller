import {Injectable, isDevMode, OnInit} from '@angular/core';
import {Headers, Http} from "@angular/http";
import 'rxjs';
import {User} from "./user.model";
import {Router} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {environment} from '../../environments/environment';

@Injectable()
export class AccountManagerService {

  public loggedIn = false;
  public currentUser: User;
  public token: string;



  private headers = new Headers({'Content-Type': 'application/json'});


  constructor(private http: Http, private router: Router) {

    const resultToken = localStorage.getItem('session');
    if (!isNullOrUndefined(resultToken)) {

      this.getCurrentUser(this.token).then(userResult => {
        if (!isNullOrUndefined(userResult)) {
          this.loggedIn = true;
          this.token = resultToken;
        }else {
          this.loggedIn = false;
          this.token = null;
        }
      });
    }
  }

  isLoggedIn(): Boolean {
    const loggedInCopy =  this.loggedIn;

    if (!isNullOrUndefined(this.token) && loggedInCopy) {
      return true;
    }else {
      console.log('we are not logged in');
      return false;
    }
  }

  signIn(email: String, password: String): Promise<any>{

    //return a new promise from an http post to signin that then gets the current user with the token that is returned

    return this.http.post(environment.apiUrl + '/api/signin', JSON.stringify({
      'email' : email,
      'password': password
    }), {headers: this.headers}).toPromise().then(res => {
      const body = JSON.parse(res['_body']);

        if (body.payload.success === true){

          this.loggedIn = true;
          this.token = body.payload.token;

          localStorage.setItem('session', this.token);

          //call our getCurrentUser method which returns a promise and use the user created from that

          this.getCurrentUser(this.token).then(userResult => {
            if (!isNullOrUndefined(userResult)) {
              this.loggedIn = true;
            }else {
              this.loggedIn = false;
            }
          });
          //there was a problem signing in and we didnt even get the user
        }else {
          this.loggedIn = false;
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
    }),{headers: this.headers})
      .toPromise();
  }

  getCurrentUser(token: String): Promise<User> {
    return this.http.post(environment.apiUrl + '/api/currentuser' , JSON.stringify({
      'token': token
    }), {headers: this.headers}).toPromise().then(res => {
      const body = JSON.parse(res['_body']);
      if (body.payload.success !== false) {
        return new User(body.payload.result.fullname, body.payload.result.email, body.payload.result.userID);
      }else {
        return null;
      }
    });
  }

  signOut() {

    if (confirm('Are you sure you want to log out?')) {
      // Save it!
      this.loggedIn = false;
      localStorage.clear();

    } else {
      // Do nothing!
    }
    console.log(this.loggedIn);

  }

}
