import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HangmanComponent } from './left/hangman/hangman.component';
import { HintsComponent } from './left/hints/hints.component';
import { KeypadComponent } from './right/keypad/keypad.component';
import { ActionsComponent } from './center/actions/actions.component';
import { HeaderComponent } from './header/header.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import { GuessComponent } from './right/guess/guess.component';
import { ResultComponent } from './center/result/result.component';
import {HttpClientModule} from "@angular/common/http";
import { KeyComponent } from './right/key/key.component';
import { StatusComponent } from './center/status/status.component';

@NgModule({
  declarations: [
    AppComponent,
    HangmanComponent,
    HintsComponent,
    KeypadComponent,
    ActionsComponent,
    HeaderComponent,
    GuessComponent,
    ResultComponent,
    KeyComponent,
    StatusComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
