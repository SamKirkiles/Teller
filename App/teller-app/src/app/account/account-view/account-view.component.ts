import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AccountManagerService} from '../../auth/account-manager.service';
import {User} from '../../auth/user.model';
import {Router} from '@angular/router';
import {Headers, Http} from '@angular/http';
import {environment} from '../../../environments/environment';
import 'rxjs';
import {isNullOrUndefined} from "util";


declare var window: any;
declare var FB: any;



@Component({
  selector: 'app-account-view',
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.css']
})
export class AccountViewComponent implements OnInit {

  currentUser: User;
  displayFB = true;
  private headers = new Headers({'Content-Type': 'application/json'});



constructor(private accountManager: AccountManagerService, private router: Router, private http: Http) {
    this.getUser().then(user =>{
    });

  }


  ngOnInit() {
    if (window.FB) {
        window.FB.XFBML.parse();
    }


  }

  getUser(): Promise<User> {
      return this.accountManager.getCurrentUser().then( user => {
        this.currentUser = user;
        return user;
      });
  }

  linkAccountPressed() {
      this.router.navigate(['/linkaccount']);
  }

}
