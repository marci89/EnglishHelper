import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { WordEditComponent } from './components/words/word-edit/word-edit.component';
import { WordListComponent } from './components/words/word-list/word-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { HomeComponent } from './components/home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { SharedModule } from './modules/shared.module';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { UserRegisterComponent } from './components/users/user-register/user-register.component';
import { HasRoleDirective } from './directives/has-role.directive';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    WordEditComponent,
    WordListComponent,
    UserListComponent,
    HomeComponent,
    UserRegisterComponent,
    HasRoleDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
