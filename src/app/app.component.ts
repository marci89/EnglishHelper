import { Component, OnInit } from '@angular/core';
import { AccountService } from './services/common/account.service';
import { LoginUser } from './interfaces/user.interface';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './services/common/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
  private accountService: AccountService,
   public translate: TranslateService,
   private languageService: LanguageService)
  {
  }

  ngOnInit(): void {
    this.setCurrentUser();
    this.languageService.initialize();
  }

  //Setting the user from a cookie if the user have already logged in before
  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user: LoginUser = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }
}
