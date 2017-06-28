import {Injectable, isDevMode, OnInit} from '@angular/core';
import {Headers, Http} from "@angular/http";
import 'rxjs';
import {User} from "./user.model";
import {Router} from "@angular/router";
import {isNullOrUndefined} from "util";
import {environment} from "../../environments/environment";

@Injectable()
export class AccountManagerService{

  public loggedIn = false;
  public currentUser:User;
  public token:string;



  private headers = new Headers({'Content-Type': 'application/json'});


  constructor(private http:Http, private router: Router) {



    let token = localStorage.getItem('session');
    if (!isNullOrUndefined(token)){

      this.getCurrentUser(token).then(res =>{

        let body = JSON.parse(res['_body']);
          if (body.payload.success){
            this.loggedIn = true;
          }
        });
    }
  }

  isLoggedIn():Boolean{
    var loggedInCopy =  this.loggedIn;

    if (!isNullOrUndefined(this.token) && loggedInCopy){
      return true;
    }else{
      return false;
    }
  }

  signIn(email:String,password:String):Promise<any>{

    return this.http.post(environment.apiUrl + '/api/signin',JSON.stringify({
      "email": email,
      "password": password
    }),{headers: this.headers}).toPromise().then(res => {


      let body = JSON.parse(res["_body"]);

        if (body.payload.success === true){

          this.loggedIn = true;
          this.token = body.payload.token;

          localStorage.setItem("session",this.token);

          this.getCurrentUser(this.token).then(userResult => {
            let userBody = JSON.parse(userResult["_body"]);
            console.log(userBody.payload.success);
            if (userBody.payload.success === true){
              this.loggedIn = true;
              this.currentUser = new User(userBody.payload.result.fullname, userBody.payload.result.email, userBody.payload.result.userID);
            }else{
              this.loggedIn = false;
            }
            return userResult;
          });
        }else{
          this.loggedIn = false;
          this.token = null;
        }

      return res;

    })
  }

  signUp(fullname:String,password:String,email:String):Promise<any>{
      return this.http.post(environment.apiUrl + '/api/signup',JSON.stringify({
      "fullname":fullname,
      "password":password,
      "email":email
    }),{headers: this.headers})
      .toPromise()
  }

  getCurrentUser(token:String):Promise<any>{


    return this.http.post(environment.apiUrl + '/api/currentuser' , JSON.stringify({
      "token":token
    }), {headers: this.headers}).toPromise()
  }

  signOut(){

    if (confirm('Are you sure you want to log out?')) {
      // Save it!
      this.loggedIn = false;
      localStorage.clear();

    } else {
      // Do nothing!
    }
    console.log(this.loggedIn)

  }

}
