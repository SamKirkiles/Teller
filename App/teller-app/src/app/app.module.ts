import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { HomeComponentComponent } from './home-component/home-component.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    HomeComponentComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [HeaderComponent]
})
export class AppModule { }
