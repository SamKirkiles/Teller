import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {AccountManagerService} from "./account-manager.service";


@Injectable()
export class AuthGuard implements CanActivate{

  constructor(private router: Router, private accountManager: AccountManagerService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Promise<boolean> | boolean{

    // we need to use async canActivate here
      return this.accountManager.isLoggedIn().then(response => {
          if (response === false) {
              this.router.navigate(['/login']);
          }
          return response;
      });
  }
}