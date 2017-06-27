import {Injectable, OnInit} from '@angular/core';
import {Headers, Http} from "@angular/http";
import 'rxjs';
import {User} from "./user.model";
import {Router} from "@angular/router";

@Injectable()
export class AccountManagerService{

  public loggedIn = false;
  public currentUser:User;
  public token:String;


  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http:Http, private router: Router) {
  }

  signIn(email:String,password:String):Promise<any>{

    return this.http.post('http://localhost:3000/api/signin',JSON.stringify({
      "email": email,
      "password": password
    }),{headers: this.headers}).toPromise().then(res => {

      console.log('THis should be called');

      let body = JSON.parse(res["_body"]);

        if (body.payload.success === true){

          this.loggedIn = true;
          this.token = body.payload.token;

          console.log("cookie should be set here");

          document.cookie = "session="+this.token;

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
    return this.http.post('http://localhost:3000/api/signup',JSON.stringify({
      "fullname":fullname,
      "password":password,
      "email":email
    }),{headers: this.headers})
      .toPromise()
  }

  getCurrentUser(token:String):Promise<any>{
    return this.http.post('http://localhost:3000/api/currentuser' , JSON.stringify({
      "token":token
    }), {headers: this.headers}).toPromise()
  }

  signOut(){

    if (confirm('Are you sure you want to log out?')) {
      // Save it!
      this.loggedIn = false;

    } else {
      // Do nothing!
    }
    console.log(this.loggedIn)
    
  }

}
