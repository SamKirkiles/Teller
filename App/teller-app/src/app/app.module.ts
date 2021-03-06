import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HomeComponentComponent } from './home-component/home-component.component';
import { HeaderComponent } from './header/header.component';
import {RouterModule, Routes} from '@angular/router';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { LogInComponent } from './auth/log-in/log-in.component';
import {AccountManagerService} from './auth/account-manager.service';
import { AccountComponent } from './account/account.component';
import { AccountFormComponent } from './account/account-form/account-form.component';
import { AccountViewComponent } from './account/account-view/account-view.component';
import { AccountPasswordResetComponent } from './account/account-password-reset/account-password-reset.component';
import {AuthGuard} from './auth/auth-guard';
import { LinkAccountComponent } from './account/link-account/link-account.component';
import { FooterComponent } from './footer/footer/footer.component';
import { SignupConfirmComponent } from './auth/signup-confirm/signup-confirm.component';
import { VerifyAccountComponent } from './auth/verify-account/verify-account.component';
import { ResendConfirmationComponent } from './auth/resend-confirmation/resend-confirmation.component';
import { AuthorizeMessengerComponent } from './auth/authorize-messenger/authorize-messenger.component';
import {MessengerAuthorizationService} from './auth/messenger-authorization.service';
import {ViewTransactionsComponent} from './webviews/view-transactions/view-transactions.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { BudgetViewComponent } from './webviews/budget-view/budget-view.component';

const appRoutes: Routes = [
    {path: '', component: HomeComponentComponent},
    {path: 'signup', component: SignUpComponent},
    {path: 'signup/confirm', component: SignupConfirmComponent},
    {path: 'login', component: LogInComponent},
    {path: 'account', component: AccountComponent, canActivate: [AuthGuard]},
    {path: 'resetpassword', component: AccountPasswordResetComponent},
    {path: 'linkaccount', component: LinkAccountComponent, canActivate: [AuthGuard]},
    {path: 'verifyaccount/:token', component: VerifyAccountComponent},
    {path: 'authorize', component: AuthorizeMessengerComponent},
    {path: 'resendconfirmation', component: ResendConfirmationComponent},
    {path: 'viewtransactions', component: ViewTransactionsComponent},
    {path: 'budgetview', component: BudgetViewComponent},
    {path: '**', component: NotFoundComponent}
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
    LinkAccountComponent,
    FooterComponent,
    SignupConfirmComponent,
    VerifyAccountComponent,
    ResendConfirmationComponent,
    AuthorizeMessengerComponent,
    ViewTransactionsComponent,
    NotFoundComponent,
    BudgetViewComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule
  ],
  providers: [AuthGuard, AccountManagerService, MessengerAuthorizationService],
  bootstrap: [HeaderComponent]
})
export class AppModule {

}
