import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {AccountManagerService} from "./account-manager.service";


@Injectable()
export class AuthGuard implements CanActivate{

  constructor(private router: Router, private accountManager: AccountManagerService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<boolean> | boolean{

    if (this.accountManager.isLoggedIn()){
      return true;
    }else{
      this.router.navigate(['/login']);
      return false;
    }

  }
}
