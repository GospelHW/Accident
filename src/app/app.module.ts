import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {AppRoutingModule} from './app.routing';
import {HttpClientModule} from '@angular/common/http';
import {PageModule} from './page/page.module';
import {GlobalState} from './global.state';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    PageModule,
    AppRoutingModule
  ],
  providers: [GlobalState],
  bootstrap: [AppComponent]
})
export class AppModule { }
