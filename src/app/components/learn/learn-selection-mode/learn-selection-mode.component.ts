import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CreateLearnStatisticsRequest } from 'src/app/interfaces/learn-statistics.interface';
import { LearnSettingsModel } from 'src/app/interfaces/learn.interface';
import { ListWordWithFilterRequest, UpdateUsedWordRequest, Word } from 'src/app/interfaces/word.interface';
import { LearnStatisticsService } from 'src/app/services/learn-statistics.service';
import { LearnService } from 'src/app/services/learn.service';
import { TextToSpeechService } from 'src/app/services/text-to-speech.service';
import { WordService } from 'src/app/services/word.service';

@Component({
  selector: 'app-learn-selection-mode',
  templateUrl: './learn-selection-mode.component.html',
  styleUrls: ['./learn-selection-mode.component.css']
})
export class LearnSelectionModeComponent implements OnInit, OnDestroy {
  //learning word list
  words: Word[] = [];
  //All of words from server
  allWords: Word[] = [];
  wordListSubscription$: Subscription | undefined;
  //selectable word list
  selectableWords: Word[] = [];
  //Actual word
  currentWord: Word | null = {} as Word;
  //learning word list count number
  wordListTotalCount: number = 0;
  //Solved learning word list count number
  solvedWordListCount: number = 0;

  //Error
  serverError: string = '';
  //message
  message: string = '';
  isSuccesssMessage: boolean = false;

  //Learn result in percent
  result: number = 100;
  //good words
  correctWordListCount: number = 0;
  //bad words
  incorrectWordListCount: number = 0;

  //card text
  cardText?: string | null = '';

  //finished
  isFinished: boolean = false;

  //text long check
  isTextTooLong: boolean = false;

  //settings variables
  settings: LearnSettingsModel = {} as LearnSettingsModel;

  constructor(
    private wordService: WordService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private learnService: LearnService,
    private textToSpeechService: TextToSpeechService,
    private learnStatisticsService: LearnStatisticsService
  ) { }

  ngOnInit() {

    this.listAllWord();
    this.initLearn();

    //subscribe word list to update the table from different components
    this.wordListSubscription$ = this.wordService.wordList$.subscribe({
      next: words => {
        this.allWords = words ?? [];
      }
    });
  }

  // list all of words from server
  listAllWord() {
    this.wordService.list().subscribe({
      next: _ => { },
      error: error => {
        this.toastr.error(this.translate.instant(error.error))
      }
    })
  }

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
      next: words => {
        this.words = words;

        //check the word count
        if (this.words && this.words.length > 0) {
          this.learnService.shuffleArray(this.words);
          this.setCurrentWord();
          this.CheckCardTextLong(this.currentWord);
          this.setCardText();
          this.wordListTotalCount = words.length;
        }
      },
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

  //set selectable word list
  setSelectableWordList() {
    if (this.currentWord) {
      //Check minimum length
      if (this.allWords.length < 2) {
        this.serverError = this.translate.instant('MinSelectableWord');
      }
      //Check maximum length
      if (this.settings.selectableWordNumber > 10)
        this.settings.selectableWordNumber == 10;

      this.selectableWords = [];
      this.learnService.shuffleArray(this.allWords);

      const numberOfSelection = this.settings.selectableWordNumber > this.allWords.length
        ? this.allWords.length
        : this.settings.selectableWordNumber;

      this.selectableWords = [...this.allWords
        .slice(0, numberOfSelection)
        .filter(item => item.id !== this.currentWord?.id)
      ];

      this.selectableWords.length === numberOfSelection
        ? this.selectableWords[0] = this.currentWord
        : this.selectableWords.push(this.currentWord);

      this.learnService.shuffleArray(this.selectableWords);
    }
  }

  //set the current word to next from the words list
  setCurrentWord() {
    if (this.words && this.words.length > 0) {
      this.currentWord = this.words[0];
      this.setSelectableWordList();
      this.speak();
      console.log(this.words.length)
    } else {
      debugger;
      //create static about the result
      this.CreateLearnStatistics();
      //end of the learn
      this.isFinished = true;
    }
  }

  //Set the card text
  setCardText() {
    this.cardText = this.settings.isEnglishToHungarian
      ? this.currentWord?.englishText : this.currentWord?.hungarianText
    this.CheckCardTextLong(this.currentWord);
  }

  //check smaller font-size if you have longer word
  CheckCardTextLong(word: Word | null) {
    this.isTextTooLong = this.CheckTextLong(word)
  }

  //validate the actual word actual language and set smaller size if have to
  // or set the row column size in template depends on word long, too.
  CheckTextLong(word: Word | null) {
    if (word) {
      const text = this.settings.isEnglishToHungarian
        ? word.englishText ?? ''
        : word.hungarianText ?? '';
      return text.length > 100;
    }
    return false;
  }

  //get selectable button text
  getSelectableButtonText(id: number): string | undefined {
    const word = this.selectableWords.find(item => item.id === id);
    if (word)
      return this.settings.isEnglishToHungarian
        ? word?.hungarianText : word?.englishText

    return '';
  }

  //choosabe word button click (select)
  select(id: number) {
    // looking for the text
    const text = this.settings.isEnglishToHungarian
      ? this.currentWord?.hungarianText ?? ''
      : this.currentWord?.englishText ?? '';

    //check by id
    if (this.currentWord?.id === id) {
      this.correctWordListCount++;
      this.isSuccesssMessage = true;
      this.message = this.translate.instant('SelectedCorrectWord');
      this.setNextWord(true);
    }
    else {
      this.incorrectWordListCount++;
      this.isSuccesssMessage = false;
      this.message = this.translate.instant('SelectedIncorrectWord') + ' ' + text;
      this.setNextWord(false);
    }
  }

  // Common logic for set next word
  setNextWord(isCorrect: boolean) {
    setTimeout(() => {
      this.serverError = "";
      this.message = "";

      this.solvedWordListCount++;
      this.updateUsedWord(isCorrect);
      this.deleteFirstElement();
      this.calculateResult();
      this.setCurrentWord();
      this.CheckCardTextLong(this.currentWord);
      this.setCardText();
    }, 3000);
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
      const text = this.settings.isEnglishToHungarian
        ? this.currentWord?.englishText
        : this.currentWord?.hungarianText;
      this.textToSpeechService.speak(text ?? '');
    }
  }

  //Calculate the result in percentage
  calculateResult() {
    const percentage = (this.correctWordListCount / this.solvedWordListCount) * 100;
    this.result = parseFloat(percentage.toFixed(0));
  }

  // create learn statistics
  CreateLearnStatistics() {
    // Initialize the serviceRequest object
    const serviceRequest: CreateLearnStatisticsRequest = {
      correctCount: this.correctWordListCount,
      incorrectCount: this.incorrectWordListCount,
      result: this.result,
      LearnMode: this.settings.learnModeType
    };

    this.learnStatisticsService.create(serviceRequest).subscribe({})
  }

  ngOnDestroy() {
    if (this.wordListSubscription$) {
      this.wordListSubscription$.unsubscribe();
    }
  }
}
