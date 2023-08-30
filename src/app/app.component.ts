import { Component, OnInit } from '@angular/core';
import { AccountService } from './services/common/account.service';
import { User } from './interfaces/user-interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private accountService: AccountService, public translate: TranslateService)
  {
    translate.addLangs(['en', 'hu']);
    translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.setCurrentUser();
  }

  //Setting the user from a cookie if the user have already logged in before
  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user: User = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }
}
