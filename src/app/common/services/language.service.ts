import { Injectable, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '../interfaces/language.interface';
import { PrimeNGConfig } from 'primeng/api';
import { TimeagoIntl } from 'ngx-timeago';
import { NgcCookieConsentService } from 'ngx-cookieconsent';

// language service
@Injectable({
  providedIn: 'root'
})
export class LanguageService implements OnInit {
  private languages: Language[] = [];
  private selectedLanguage: Language | undefined;

  constructor(
    private translate: TranslateService,
    private primengConfig: PrimeNGConfig,
    private intl: TimeagoIntl,
    private ccService: NgcCookieConsentService
    ) { }

  ngOnInit() {
    this.configureCookieConsent();
  }

  // init language things
  initialize() {
    this.translate.addLangs(['en', 'hu']);
    const defaultLanguage = "en";
    this.translate.setDefaultLang(defaultLanguage);

    const storedLanguage = localStorage.getItem('selectedLanguage') || this.translate.getDefaultLang();
    this.translate.use(storedLanguage);

    const languageCodes = this.translate.getLangs();
    this.languages = languageCodes.map(code => ({
      name: this.getLanguageName(code),
      code: code
    } as Language));

    // Set the selectedLanguage to the default language
    this.selectedLanguage = this.languages.find(language => language.code === storedLanguage);

    this.switchLanguage(storedLanguage);
  }

  //Change langugae
  switchLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('selectedLanguage', lang);

    //if you use primeNG
    this.translate.get('primeng').subscribe(res => this.primengConfig.setTranslation(res));

    //if you use ngx-timeago
    this.translate.get('ngx-timeago').subscribe(res => {
      this.intl.strings = res;
      this.intl.changes.next();
    });

    //if you use NgcCookieConsentService
    this.configureCookieConsent();
  }

  configureCookieConsent() {
    this.translate
      .get(['cookie.header', 'cookie.message', 'cookie.dismiss', 'cookie.allow', 'cookie.deny', 'cookie.link', 'cookie.policy'])
      .subscribe(data => {

        // Update the content of the configuration with translated messages
        this.ccService.getConfig().content = {
          header: data['cookie.header'],
          message: data['cookie.message'],
          dismiss: data['cookie.dismiss'],
          allow: data['cookie.allow'],
          deny: data['cookie.deny'],
          link: data['cookie.link'],
          policy: data['cookie.policy']
        };

        // Reinitialize the cookie consent banner with the updated configuration
        this.ccService.destroy(); // Remove previous cookie bar (with default messages)
        this.ccService.init(this.ccService.getConfig());// update config with translated messages
      });
  }

  // Get language
  getLanguages(): Language[] {
    return this.languages;
  }

  //Get current language
  getSelectedLanguage(): Language | undefined {
    return this.selectedLanguage;
  }

  //Get language name from code
  private getLanguageName(code: string): string {
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
