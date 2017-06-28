import { Component, OnInit } from '@angular/core';
import {AccountManagerService} from "../../auth/account-manager.service";
import {User} from "../../auth/user.model";
import {FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.css']
})
export class AccountFormComponent implements OnInit {

  constructor(private accountManager: AccountManagerService) {
  }

  accountForm = new FormGroup({
    fullname: new FormControl('', Validators.email),
    currentpass: new FormControl('', Validators.minLength(8)),
    newpass: new FormControl('', Validators.minLength(8)),
    confirmpass: new FormControl('', Validators.minLength(8))
  });

  ngOnInit() {
  }

  getUser():User {

    if (this.accountManager.loggedIn) {
      return this.accountManager.currentUser;
    } else {
      return null;
    }
  }

  savePressed(){
    console.log('save new user');
  }

}
