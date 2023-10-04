import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CreateLearnStatisticsRequest } from 'src/app/interfaces/learn-statistics.interface';
import { LearnSettingsModel } from 'src/app/interfaces/learn.interface';
import { ListWordWithFilterRequest, UpdateUsedWordRequest, Word } from 'src/app/interfaces/word.interface';
import { LearnStatisticsService } from 'src/app/services/learn-statistics.service';
import { LearnService } from 'src/app/services/learn.service';
import { TextToSpeechService } from 'src/app/services/text-to-speech.service';
import { WordService } from 'src/app/services/word.service';

@Component({
  selector: 'app-learn-mode-base',
  template: '', // No template is specified
  styleUrls: [] // No styles are specified
})
export class LearnModeBaseComponent {

  //settings variable
  settings: LearnSettingsModel = {} as LearnSettingsModel;

  //learning word list
  words: Word[] = [];
  //Actual word
  currentWord: Word | null = {} as Word;
  //learning word list count number
  wordListTotalCount: number = 0;
  //Solved learning word list count number
  solvedWordCount: number = 0;
  //Learn result in percent
  result: number = 100;
  //good words
  correctWordCount: number = 0;
  //bad words
  incorrectWordCount: number = 0;

  //text long check
  isTextTooLong: boolean = false;

  //Error message
  serverError: string = '';
  //card text
  cardText?: string | null = '';
  //message
  message: string = '';
  // check message is success or not
  isSuccesssMessage: boolean = false;

  //while waiting disabled the buttons
  waiting: boolean = false;
  //finished
  isFinished: boolean = false;

  constructor(
    protected wordService: WordService,
    protected learnService: LearnService,
    protected toastr: ToastrService,
    protected translate: TranslateService,
    protected textToSpeechService: TextToSpeechService,
    protected learnStatisticsService: LearnStatisticsService
  ) { }

  //Set all of variables to start the learning
  initLearn() {
    //get settings options
    this.settings = this.learnService.readLearnSettings();
    //list learning words (filtered by settings option)
    this.listWord();
  }


  // list filtered words
  listWord() {
    // Initialize the serviceRequest object
    const serviceRequest: ListWordWithFilterRequest = {
      wordNumber: this.settings.wordNumber,
      orderType: this.settings.wordOrderingType,
    };

    this.wordService.listWithFilter(serviceRequest).subscribe({
      next: _ => { },
      error: _ => {
        this.serverError = "NoWordList";
      }
    })
  }

  // Update used word
  updateUsedWord(isCorrect: boolean) {
    // Initialize the serviceRequest object
    const serviceRequest: UpdateUsedWordRequest = {
      id: this.currentWord?.id ?? 0,
      isCorrect: isCorrect
    };

    this.wordService.updateUsedWord(serviceRequest).subscribe({
      next: _ => {
      },
      error: error => {
        this.toastr.error(this.translate.instant(error.error))
      }
    })
  }

  // create learn statistics
  CreateLearnStatistics() {
    // Initialize the serviceRequest object
    const serviceRequest: CreateLearnStatisticsRequest = {
      correctCount: this.correctWordCount,
      incorrectCount: this.incorrectWordCount,
      result: this.result,
      LearnMode: this.settings.learnModeType
    };

    this.learnStatisticsService.create(serviceRequest).subscribe({})
  }

  //Delete the first element from word list array
  deleteFirstElement() {
    if (this.words && this.words.length > 0) {
      this.words.shift();
    }
  }

  //speak the word
  speak() {
    if (this.settings.enableSound) {
      const text = this.settings.isEnglishToHungarian ? this.currentWord?.englishText : this.currentWord?.hungarianText;
      this.textToSpeechService.speak(text ?? '');
    }
  }

  //Calculate the result in percentage
  calculateResult() {
    const percentage = (this.correctWordCount / this.solvedWordCount) * 100;
    this.result = parseFloat(percentage.toFixed(0));
  }

  //Set the card text
  setCardText() {
    this.cardText = this.settings.isEnglishToHungarian
      ? this.currentWord?.englishText : this.currentWord?.hungarianText
    this.CheckCardTextLong(this.currentWord);
  }

  //check smaller font-size if you have longer word
  CheckCardTextLong(word: Word | null) {
    this.isTextTooLong = this.CheckTextLong(word);
  }

  //validate the actual word actual language and set smaller size if have to
  // or set the row column size in template depends on word long, too.
  CheckTextLong(word: Word | null): boolean {
    return this.learnService.checkTextLong(word, this.settings.isEnglishToHungarian);
  }
}