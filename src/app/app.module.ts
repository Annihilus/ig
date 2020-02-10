import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CharsComponent } from './chars/chars.component';
import { CharComponent } from './char/char.component';
import { CharService } from './char/char.service';
import { NavComponent } from './nav/nav.component';


@NgModule({
  declarations: [
    AppComponent,
    CharsComponent,
    CharComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [
    AngularFirestore,
    CharService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
