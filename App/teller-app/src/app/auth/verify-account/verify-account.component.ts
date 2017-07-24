import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Http} from "@angular/http";
import {AccountManagerService} from "../account-manager.service";

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.css']
})
export class VerifyAccountComponent implements OnInit {

    id: String = null;
    verified: Boolean = false;

    constructor(private route: ActivatedRoute, private accountManager: AccountManagerService) {
  }

  ngOnInit() {
      this.id = this.route.snapshot.params['token'];

      this.accountManager.verifyAccount(this.id).then(res => {
          const body = JSON.parse(res['_body']);
          this.verified = body.payload.success;
      });


  }


}
