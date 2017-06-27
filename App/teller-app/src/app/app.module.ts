import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';

import { HomeComponentComponent } from './home-component/home-component.component';
import { HeaderComponent } from './header/header.component';
import {RouterModule, Routes} from "@angular/router";
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { LogInComponent } from './auth/log-in/log-in.component';
import {AccountManagerService} from './auth/account-manager.service';
import { AccountComponent } from './account/account.component';
import { AccountFormComponent } from './account/account-form/account-form.component';
import { AccountViewComponent } from './account/account-view/account-view.component';
import { AccountPasswordResetComponent } from './account/account-password-reset/account-password-reset.component';
import {AuthGuard} from './auth/auth-guard';

const appRoutes: Routes = [
  {path:'', component:HomeComponentComponent},
  {path:'signup', component:SignUpComponent},
  {path: 'login', component:LogInComponent},
  {path: 'account', component:AccountComponent, canActivate:[AuthGuard]},
  {path: 'resetpassword', component:AccountPasswordResetComponent}
];

@NgModule({
  declarations: [
    HomeComponentComponent,
    HeaderComponent,
    SignUpComponent,
    LogInComponent,
    AccountComponent,
    AccountFormComponent,
    AccountViewComponent,
    AccountPasswordResetComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule
  ],
  providers: [AuthGuard, AccountManagerService],
  bootstrap: [HeaderComponent]
})
export class AppModule { }
