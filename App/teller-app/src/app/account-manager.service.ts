import { Injectable } from '@angular/core';
import {Headers, Http} from "@angular/http";
import 'rxjs';
import {User} from "./auth/user.model";

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
        console.log(res);
      })
  }

}
