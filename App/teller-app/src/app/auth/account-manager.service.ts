import { Injectable } from '@angular/core';
import {Headers, Http} from "@angular/http";
import 'rxjs';
import {User} from "./user.model";

@Injectable()
export class AccountManagerService {

  public loggedIn = false;
  public currentUser:User;


  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http:Http) {
  }

  signIn(email:String,password:String):Promise<any>{
    return this.http.post('http://localhost:3000/api/signin',JSON.stringify({
      "email": email,
      "password": password
    }),{headers: this.headers})
      .toPromise()
      .then(res => {
        let body = JSON.parse(res["_body"]);

        if (body.payload.success === true){
          this.loggedIn = true;
          let tempUser = JSON.parse(body.payload.user);
          this.currentUser = new User(tempUser.fullname, tempUser.email, tempUser.userID);

        }else{
          this.loggedIn = false;
          this.currentUser = null;
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
