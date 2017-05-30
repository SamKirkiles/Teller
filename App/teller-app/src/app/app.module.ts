import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';

import { HomeComponentComponent } from './home-component/home-component.component';
import { HeaderComponent } from './header/header.component';
import {RouterModule, Routes} from "@angular/router";
import { SignUpComponent } from './sign-up/sign-up.component';
import { LogInComponent } from './log-in/log-in.component';

const appRoutes: Routes = [
  {path:'', component:HomeComponentComponent},
  {path:'signup', component:SignUpComponent},
  {path: 'login', component:LogInComponent}
];

@NgModule({
  declarations: [
    HomeComponentComponent,
    HeaderComponent,
    SignUpComponent,
    LogInComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [HeaderComponent]
})
export class AppModule { }
