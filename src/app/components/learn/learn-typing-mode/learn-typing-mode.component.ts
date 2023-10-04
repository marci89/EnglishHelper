import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CreateLearnStatisticsRequest } from 'src/app/interfaces/learn-statistics.interface';
import { LearnSettingsModel, startAndEndLetternumber } from 'src/app/interfaces/learn.interface';
import { ListWordWithFilterRequest, UpdateUsedWordRequest, Word } from 'src/app/interfaces/word.interface';
import { LearnStatisticsService } from 'src/app/services/learn-statistics.service';
import { LearnService } from 'src/app/services/learn.service';
import { TextToSpeechService } from 'src/app/services/text-to-speech.service';
import { WordService } from 'src/app/services/word.service';
import { LearnModeBaseComponent } from '../learn-mode-base/learn-mode-base.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-learn-typing-mode',
  templateUrl: './learn-typing-mode.component.html',
  styleUrls: ['./learn-typing-mode.component.css']
})
export class LearnTypingModeComponent extends LearnModeBaseComponent implements OnInit, OnDestroy {
  //word input
  wordInput: string = "";
  //word input mask
  wordInputMask: string = "";
  //looking for word
  searchedWord: string = "";
  //start Letters
  startLetters: string = "";
  //end Letters
  endLetters: string = "";

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
          this.CheckCardTextLong(this.currentWord);
          this.setCardText();
          this.wordListTotalCount = words.length;
        }
      }
    });

    this.initLearn();
  }

  //Set word input
  setWordInput() {
    if (this.currentWord) {
      this.searchedWord = '';
      this.startLetters = '';
      this.endLetters = '';
      //original text
      const text = this.settings.isEnglishToHungarian
        ? this.currentWord?.hungarianText ?? ''
        : this.currentWord?.englishText ?? '';

      //checking start and end parts if we set it
      if ((this.settings.numberOfStartLetter > 0 || this.settings.numberOfEndLetter > 0) && text.length > 1) {
        this.setSplittedWord(text);
      } else {
        this.createInputMask(text);
        this.searchedWord = text;
      }
    }
  }

  //Split the word three part
  setSplittedWord(text: string) {
    const wordPartsCharacterNumber = this.SetWordPartsToSplit(
      this.settings.numberOfStartLetter,
      this.settings.numberOfEndLetter,
      text.length
    )

    // Get the first characters
    const firstCharacters = text.substring(0, wordPartsCharacterNumber.startLetterNumber);
    // Get the last characters
    const lastCharacters = text.substring(text.length - wordPartsCharacterNumber.endLetterNumber);
    // Calculate the remaining characters by removing the first and last characters
    const remainingText = text.substring(
      wordPartsCharacterNumber.startLetterNumber,
      text.length - wordPartsCharacterNumber.endLetterNumber
    );

    this.createInputMask(remainingText);
    this.searchedWord = remainingText;
    this.startLetters = firstCharacters;
    this.endLetters = lastCharacters;
  }

  //check text long validating for splitting and set perfect parts for ending and starting letters
  SetWordPartsToSplit(start: number, end: number, textLength: number): startAndEndLetternumber {
    let startLetterNumber = 0;
    let endLetterNumber = 0;

    debugger;
    //if the original text shorter than end+start
    if ((end + start) > textLength + 1) {
      if (start === 0 && end > 0) {
        endLetterNumber = textLength - 1;
      } else if (start > 0 && end === 0) {
        startLetterNumber = textLength - 1;
      } else if (start > 0 && end > 0) {
        if (textLength > 2) {
          const value = Math.floor(textLength / 2);
          startLetterNumber = textLength % 2 === 0 || value % 2 === 0 ? value - 1 : value;
          endLetterNumber = value;
        } else {
          startLetterNumber = 1;
        }
      }
    } else {
      startLetterNumber = start;
      endLetterNumber = end;
    }

    const response: startAndEndLetternumber = {
      startLetterNumber: startLetterNumber,
      endLetterNumber: endLetterNumber
    };
    return response;
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
      this.CreateLearnStatistics();
      //end of the learn
      this.isFinished = true;
    }
  }

  //click the button to check text input
  onClickNextButton() {
    //check by id
    if (this.wordInput === this.searchedWord) {
      this.correctWordCount++;
      this.isSuccesssMessage = true;
      this.message = this.translate.instant('SelectedCorrectWord');
      this.setNextWord(true);
    }
    else {
      this.incorrectWordCount++;
      this.isSuccesssMessage = false;
      this.message = this.translate.instant('SelectedIncorrectWord') + ' ' + this.searchedWord;
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
    if (this.wordListSubscription$) {
      this.wordListSubscription$.unsubscribe();
    }
  }
}
