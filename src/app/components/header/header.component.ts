import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoginRequest } from 'src/app/interfaces/user-interface';
import { AccountService } from 'src/app/services/common/account.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  loginRequest: LoginRequest = {} as LoginRequest;
  languages: any[] = [];
  selectedLanguage: any | undefined;

  constructor(public accountService: AccountService, private router: Router, public translate: TranslateService) { }

  ngOnInit() {
    this.getLanguages();
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

  getLanguages() {
    const defaultLanguage = this.translate.getDefaultLang();
    const languageCodes = this.translate.getLangs();

    this.languages = languageCodes.map(code => ({
      name: this.getLanguageName(code),
      code: code
    }));

    // Set the selectedCountry to the default language
    this.selectedLanguage = this.languages.find(language => language.code === defaultLanguage);
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }

  getLanguageName(code: string) {
    switch (code) {
      case 'en':
        return 'English';
      case 'hu':
        return 'Hungarian';
      default:
        return 'Unknown';
    }
  }
}

