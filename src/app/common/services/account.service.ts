import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { LoginRequest, RegistrationRequest } from '../../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { ChangeEmailRequest, ChangePasswordRequest, LoginUser } from '../interfaces/account.interface';
import { BaseService } from './base.service';

//Account service
@Injectable({
  providedIn: 'root'
})
export class AccountService extends BaseService {
  private readonly USER_STORAGE_KEY = 'user';

  //Logined user subject
  private currentUserSource = new BehaviorSubject<LoginUser | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  //User's email subject
  private userEmailSubject$ = new BehaviorSubject<string>('');
  userEmail$ = this.userEmailSubject$.asObservable();

  constructor(private http: HttpClient) {
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
    return this.http.post<LoginUser>(this.baseUrl + 'account/register', request).pipe(
      map(user => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    )
  }


  // Change email and update the email subject
  changeEmail(request: ChangeEmailRequest) {
    return this.http.put(this.baseUrl + 'account/changeEmail', request).pipe(
      tap(email => {
        this.userEmailSubject$.next(request.email);
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  //Change password
  changePassword(request: ChangePasswordRequest) {
    return this.http.put(this.baseUrl + 'account/changePassword', request);
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
}
