import { Component, OnInit } from '@angular/core';
import {AccountManagerService} from "../auth/account-manager.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(private accountManager: AccountManagerService) { }

  ngOnInit() {
  }

}
