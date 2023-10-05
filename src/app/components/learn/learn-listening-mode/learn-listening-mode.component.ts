import { Component, OnDestroy, OnInit } from '@angular/core';
import { LearnModeBaseComponent } from '../learn-mode-base/learn-mode-base.component';
import { Subscription } from 'rxjs';
import { WordService } from 'src/app/services/word.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { LearnService } from 'src/app/services/learn.service';
import { TextToSpeechService } from 'src/app/services/text-to-speech.service';
import { LearnStatisticsService } from 'src/app/services/learn-statistics.service';

@Component({
  selector: 'app-learn-listening-mode',
  templateUrl: './learn-listening-mode.component.html',
  styleUrls: ['./learn-listening-mode.component.css']
})
export class LearnListeningModeComponent extends LearnModeBaseComponent implements OnInit, OnDestroy {
  //word input
  wordInput: string = "";
  //word input mask
  wordInputMask: string = "";
  //looking for word
  searchedWord: string = "";

  //Subscription
  wordListSubscription$: Subscription | undefined;

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
    //subscribe filterd word list
    this.wordListSubscription$ = this.wordService.filteredwordList$.subscribe({
      next: words => {
        this.words = words;
        //check the word count
        if (this.words && this.words.length > 0) {
          this.learnService.shuffleArray(this.words);
          this.setCurrentWord();
          this.wordListTotalCount = words.length;
        }
      }
    });

    this.initLearn();
    this.settings.enableSound = true;
    this.settings.isEnglishToHungarian;
  }

  //Set word input
  setWordInput() {
    if (this.currentWord) {
      this.searchedWord = '';
      //original text
      const text = this.currentWord?.englishText ?? '';
      this.createInputMask(text);
      this.searchedWord = text;
    }
  }

  //create input mask
  createInputMask(text: string): void {
    const specialCharacters = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\|\-="']/;
    const letters = /[a-zA-Z]/;
    const numbers = /[0-9]/;
    const space = /\s/; // Regular expression for space

    this.wordInputMask = "";

    const characterArray = Array.from(text);

    for (const char of characterArray) {
      if (specialCharacters.test(char)) {
        this.wordInputMask += char;
      } else if (letters.test(char)) {
        this.wordInputMask += 'a';
      } else if (numbers.test(char)) {
        this.wordInputMask += '9';
      } else if (space.test(char)) {
        this.wordInputMask += ' ';
      } else {
        this.wordInputMask += char;
      }
    }
  }

  //set the current word to next from the words list
  setCurrentWord() {
    if (this.words && this.words.length > 0) {
      this.currentWord = this.words[0];
      this.setWordInput();
      this.speak();
    } else {
      //create static about the result
      this.createLearnStatistics();
      //end of the learn
      this.isFinished = true;
    }
  }

  //click the button to check text input
  onClickNextButton() {
    //check by id
    if (this.wordInput === this.searchedWord) {
      this.correctWordCount++;
      this.setMessage(true)
      this.setNextWord(true);
    }
    else {
      const text = this.currentWord?.englishText;
      this.incorrectWordCount++;
      this.setMessage(false, text)
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
      this.wordInput = "";
      this.waiting = false;
    }, 2000);
  }

  //Restart the learn by the same learn settings
  restart() {
    this.resetVariables();
    this.initLearn();
  }

  ngOnDestroy() {
    if (this.wordListSubscription$) {
      this.wordListSubscription$.unsubscribe();
    }
  }
}

