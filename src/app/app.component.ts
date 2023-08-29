import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/common/auth.service';
import { User } from './interfaces/user-interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.setCurrentUser();
  }

  //Setting the user from a cookie if the user have already logged in before
  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user: User = JSON.parse(userString);
    this.authService.setCurrentUser(user);
  }
}
