import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginRequest, RegistrationRequest } from '../../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { LoginUser } from '../interfaces/account.interface';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends BaseService {
  private readonly USER_STORAGE_KEY = 'user';
  private currentUserSource = new BehaviorSubject<LoginUser | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) {
    super();
   }

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

  logout() {
    localStorage.removeItem(this.USER_STORAGE_KEY);
    this.currentUserSource.next(null);
  }

  register(request: RegistrationRequest) {
    return this.http.post<LoginUser>(this.baseUrl + 'account/register', request).pipe(
      map(user => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    )
  }

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