import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { LoginRequest } from 'src/app/interfaces/user.interface';
import { AccountService } from 'src/app/common/services/account.service';
import { LanguageService } from 'src/app/common/services/language.service';

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
    private languageService: LanguageService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.languages = this.languageService.getLanguages();
    this.selectedLanguage = this.languageService.getSelectedLanguage();
  }

  // Login
  login() {
    this.accountService.login(this.loginRequest).subscribe({
      next: _ => {
        this.router.navigateByUrl('/words');
      },
      error: error => {
        this.toastr.error(this.translate.instant(error.error));
      }
    })
  }

  //Logout
  logout() {
    this.accountService.logout();
    this.router.navigateByUrl("/");
  }

  //Change language
  switchLang(lang: string) {
    this.languageService.switchLanguage(lang);
  }
}
