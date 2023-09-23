import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/shared/header/header.component';
import { WordEditComponent } from './components/words/word-edit/word-edit.component';
import { WordListComponent } from './components/words/word-list/word-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { HomeComponent } from './components/home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor } from './common/interceptors/jwt.interceptor';
import { SharedModule } from './modules/shared.module';
import { LoadingInterceptor } from './common/interceptors/loading.interceptor';
import { UserRegisterComponent } from './components/users/user-register/user-register.component';
import { HasRoleDirective } from './common/directives/has-role.directive';
import { UtcToLocalDatePipe } from './common/pipes/utc-to-local-date.pipe';
import { TranslateDatePipe } from './common/pipes/translate-date.pipe';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserEditComponent } from './components/users/user-edit/user-edit.component';
import { ChangeEmailComponent } from './components/users/change-email/change-email.component';
import { TimeagoCustomFormatter, TimeagoFormatter, TimeagoIntl, TimeagoModule } from 'ngx-timeago';
import { UserLoginComponent } from './components/users/user-login/user-login.component';
import { WordComponent } from './components/words/word/word.component';
import { WordCreateComponent } from './components/words/word-create/word-create.component';
import { WordTabMenuComponent } from './components/words/word-tab-menu/word-tab-menu.component';
import { WordManagerComponent } from './components/words/word-manager/word-manager.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    WordEditComponent,
    WordListComponent,
    UserListComponent,
    HomeComponent,
    UserRegisterComponent,
    HasRoleDirective,
    UtcToLocalDatePipe,
    TranslateDatePipe,
    UserEditComponent,
    ChangeEmailComponent,
    UserLoginComponent,
    WordComponent,
    WordCreateComponent,
    WordTabMenuComponent,
    WordManagerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TimeagoModule.forRoot({formatter: { provide:
      TimeagoFormatter, useClass: TimeagoCustomFormatter },})
  ],
  providers: [
    MessageService,
    DialogService,
    ConfirmationService,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},
    [TimeagoIntl],
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
