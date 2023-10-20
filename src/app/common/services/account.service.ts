import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { LoginRequest, RegistrationRequest } from '../../interfaces/user.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeEmailRequest, ChangePasswordRequest, ForgotPasswordRequest, LoginUser, ResetPasswordRequest } from '../interfaces/account.interface';
import { BaseService } from './base.service';
import { TranslateService } from '@ngx-translate/core';

//Account service
@Injectable({
  providedIn: 'root'
})
export class AccountService extends BaseService {
  private readonly USER_STORAGE_KEY = 'user';

  //Logined user subject
  private currentUserSource = new BehaviorSubject<LoginUser | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private translate: TranslateService) {
    super();
  }

  //Login function
  login(request: LoginRequest) {
    return this.http.post<LoginUser>(this.baseUrl + 'Account/login', request).pipe(
      map((response: LoginUser) => {
        if (!response) {
          return;
        }
        this.setCurrentUser(response);
      })
    )
  }

  //Logout function
  logout() {
    localStorage.removeItem(this.USER_STORAGE_KEY);
    this.currentUserSource.next(null);
  }

  // User create (registration)
  register(request: RegistrationRequest) {

    // Get the current language from ngx-translate
    const selectedLanguage = this.translate.currentLang;
    const headers = new HttpHeaders({
      'Accept-Language': selectedLanguage
    });

    return this.http.post<LoginUser>(this.baseUrl + 'account/register', request, {headers}).pipe(
      map(user => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    )
  }


  // Change email and update the email subject
  changeEmail(request: ChangeEmailRequest) {
    return this.http.put(this.baseUrl + 'account/changeEmail', request)
  }

  //Change password
  changePassword(request: ChangePasswordRequest) {
    return this.http.put(this.baseUrl + 'account/changePassword', request);
  }

  //Forgot password
  forgotPassword(request: ForgotPasswordRequest){
      // Get the current language from ngx-translate
      const selectedLanguage = this.translate.currentLang;

      const headers = new HttpHeaders({
        'Accept-Language': selectedLanguage
      });

    return this.http.post(this.baseUrl + 'account/forgotPassword', request, {headers});
  }

    //Reset password
    resetPassword(request: ResetPasswordRequest){
    return this.http.put(this.baseUrl + 'account/resetPassword', request);
  }

  // set the current logined user
  setCurrentUser(user: LoginUser) {
    if (user && user.token) {
      const role = this.getDecodedToken(user.token).role;
      user.role = role;
      localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(user))
      this.currentUserSource.next(user);
    } else {
      console.error('user.token is undefined or null');
    }
  }

  //Token decoder
  getDecodedToken(token: string) {
    try {
      const tokenPayloadBase64 = token.split('.')[1];
      const tokenPayloadJson = atob(tokenPayloadBase64);
      return JSON.parse(tokenPayloadJson);
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }

  //Update current user BehaviorSubject with any property name and any value
  updateCurrentUser(propertyName: string, newValue: any) {
    const currentUser = this.currentUserSource.value;
    if (currentUser) {
      (currentUser as any)[propertyName] = newValue;
      this.setCurrentUser(currentUser);
    }
  }
}
