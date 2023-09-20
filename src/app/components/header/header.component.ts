import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/common/services/account.service';
import { LanguageService } from 'src/app/common/services/language.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
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

  //Logout
  logout() {
    this.accountService.logout();
    this.router.navigateByUrl("/login");
  }

  //Change language
  switchLang(lang: string) {
    this.languageService.switchLanguage(lang);
  }
}
