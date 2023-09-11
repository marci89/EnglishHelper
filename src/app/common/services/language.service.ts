import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '../interfaces/language.interface';

// language service
@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private languages: Language[] = [];
  private selectedLanguage: Language | undefined;

  constructor(private translate: TranslateService) { }

  // init language things
  initialize() {
    this.translate.addLangs(['en', 'hu']);
    this.translate.setDefaultLang('en');

    const storedLanguage = localStorage.getItem('selectedLanguage') || this.translate.getDefaultLang();
    this.translate.use(storedLanguage);

    const languageCodes = this.translate.getLangs();
    this.languages = languageCodes.map(code => ({
      name: this.getLanguageName(code),
      code: code
    } as Language));

    // Set the selectedLanguage to the default language
    this.selectedLanguage = this.languages.find(language => language.code === storedLanguage);
  }

  //Change langugae
  switchLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('selectedLanguage', lang);
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
