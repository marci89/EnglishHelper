import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { WordEditComponent } from './components/words/word-edit/word-edit.component';
import { WordListComponent } from './components/words/word-list/word-list.component';
import { GroupListComponent } from './components/groups/group-list/group-list.component';
import { GroupEditComponent } from './components/groups/group-edit/group-edit.component';
import { FormsModule } from '@angular/forms';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { HomeComponent } from './components/home/home.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    WordEditComponent,
    WordListComponent,
    GroupListComponent,
    GroupEditComponent,
    UserListComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
