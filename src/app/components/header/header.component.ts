import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoginRequest } from 'src/app/interfaces/user-interface';
import { AccountService } from 'src/app/services/common/account.service';
import { LanguageService } from 'src/app/services/common/language.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  loginRequest: LoginRequest = {} as LoginRequest;
  languages: any[] = [];
  selectedLanguage: any | undefined;

  constructor(
    public accountService: AccountService,
    private router: Router,
    public translate: TranslateService,
    private languageService: LanguageService) { }

  ngOnInit() {
    this.languages = this.languageService.getLanguages();
    this.selectedLanguage = this.languageService.getSelectedLanguage();
  }

  login() {
    this.accountService.login(this.loginRequest).subscribe({
      next: _ => {
        this.router.navigateByUrl('/words');
      }
    })
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl("/");
  }

  switchLang(lang: string) {
    this.languageService.switchLanguage(lang);
  }
}
