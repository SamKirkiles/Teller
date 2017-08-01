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

        console.log("This is the current user");
        console.log(user.facebookID);
    });

    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = '//connect.facebook.net/en_US/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));


    window.fbAsyncInit = () => {
        console.log("fbasyncinit")

        FB.init({
            appId            : '427920587581118',
            autoLogAppEvents : true,
            xfbml            : true,
            version          : 'v2.10'
        });
        FB.AppEvents.logPageView();


        //check to see if the user has linked their facebook account
        this.getUser().then(user =>{

            console.log(user.facebookID);

            if (user.facebookID !== null){
                FB.api('/' + user.facebookID, function(response){
                   console.log(response);
                });
            }

        });


        // subscribe to status changed and post to database when we update the user
        FB.Event.subscribe('auth.statusChange', (response => {

            if (response.status === 'connected') {

                const facebookID = response.authResponse.userID;
                const userID = this.currentUser.userID;

                this.http.post(environment.apiUrl + '/api/facebookID', JSON.stringify({
                    'userID': userID,
                    'facebookID': facebookID
                }), {headers: this.headers} ).toPromise().then(res => {
                    this.displayFB = false;
                });
            }

        }));
    };

  }


  ngOnInit() {
    if (window.FB) {
        window.FB.XFBML.parse();
    }


  }

  getUser(): Promise<User> {
    if (this.accountManager.isLoggedIn()) {
      return this.accountManager.getCurrentUser(this.accountManager.token).then( user => {
        this.currentUser = user;
        return user;
      });
    }else {
      this.currentUser = null;
    }
  }

  unlinkBankAccount() {
    //this should call an api request to remove the facebook id
  }

  unlinkFacebookAccount() {
    //this should call an api request to remove the user id
  }

  linkAccountPressed() {

      this.router.navigate(['/linkaccount']);
  }

}
