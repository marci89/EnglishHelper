import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private languages: any[] = [];
  private selectedLanguage: any | undefined;

  constructor(private translate: TranslateService) {}

  initialize() {
    this.translate.addLangs(['en', 'hu']);
    this.translate.setDefaultLang('en');

    const storedLanguage = localStorage.getItem('selectedLanguage');
    const defaultLanguage = storedLanguage || this.translate.getDefaultLang();
    const languageCodes = this.translate.getLangs();

    this.languages = languageCodes.map(code => ({
      name: this.getLanguageName(code),
      code: code
    }));

    // Set the selectedLanguage to the default language
    this.selectedLanguage = this.languages.find(language => language.code === defaultLanguage);
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('selectedLanguage', lang);
  }

  getLanguages(): any[] {
    return this.languages;
  }

  getSelectedLanguage(): any | undefined {
    return this.selectedLanguage;
  }

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
