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
import { LearnModeBaseComponent } from '../learn-mode-base/learn-mode-base.component';

@Component({
  selector: 'app-learn-selection-mode',
  templateUrl: './learn-selection-mode.component.html',
  styleUrls: ['./learn-selection-mode.component.css']
})
export class LearnSelectionModeComponent extends LearnModeBaseComponent implements OnInit, OnDestroy {
  //All of words from server
  allWords: Word[] = [];
  //selectable word list
  selectableWords: Word[] = [];

  //Subscriptions
  wordListSubscription$: Subscription | undefined;
  allWordListSubscription$: Subscription | undefined;

  constructor(
    wordService: WordService,
    toastr: ToastrService,
    translate: TranslateService,
    learnService: LearnService,
    textToSpeechService: TextToSpeechService,
    learnStatisticsService: LearnStatisticsService
  ) {
    super(wordService, learnService, toastr, translate, textToSpeechService, learnStatisticsService);
  }

  ngOnInit() {
    //subscribe all words
    this.allWordListSubscription$ = this.wordService.wordList$.subscribe({
      next: words => {
        this.allWords = words ?? [];
      }
    });

    //subscribe filterd word list
    this.wordListSubscription$ = this.wordService.filteredwordList$.subscribe({
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
      }
    });

    this.listAllWord();
    this.initLearn();
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
    } else {
      //create static about the result
      this.CreateLearnStatistics();
      //end of the learn
      this.isFinished = true;
    }
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
      this.correctWordCount++;
      this.isSuccesssMessage = true;
      this.message = this.translate.instant('SelectedCorrectWord');
      this.setNextWord(true);
    }
    else {
      this.incorrectWordCount++;
      this.isSuccesssMessage = false;
      this.message = this.translate.instant('SelectedIncorrectWord') + ' ' + text;
      this.setNextWord(false);
    }
  }

  // Common logic for set next word
  setNextWord(isCorrect: boolean) {
    this.waiting = true;
    setTimeout(() => {
      this.serverError = "";
      this.message = "";

      this.solvedWordCount++;
      this.updateUsedWord(isCorrect);
      this.deleteFirstElement();
      this.calculateResult();
      this.setCurrentWord();
      this.CheckCardTextLong(this.currentWord);
      this.setCardText();
      this.waiting = false;
    }, 3000);
  }

  ngOnDestroy() {
    if (this.allWordListSubscription$) {
      this.allWordListSubscription$.unsubscribe();
    }
    if (this.wordListSubscription$) {
      this.wordListSubscription$.unsubscribe();
    }
  }
}
