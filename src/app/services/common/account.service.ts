import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginRequest, RegistrationRequest, User } from '../../interfaces/user-interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private readonly USER_STORAGE_KEY = 'user';
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  login(request: LoginRequest) {
    return this.http.post<User>(this.baseUrl + 'Account/login', request).pipe(
      map((response: User) => {
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
    return this.http.post<User>(this.baseUrl + 'account/register', request).pipe(
      map(user => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    )
  }

  setCurrentUser(user: User) {
    localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(user))
    this.currentUserSource.next(user);
  }
}
