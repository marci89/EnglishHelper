import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CreateLearnStatisticsRequest } from 'src/app/interfaces/learn-statistics.interface';
import { LearnSettingsModel, startAndEndLetternumber } from 'src/app/interfaces/learn.interface';
import { ListWordWithFilterRequest, UpdateUsedWordRequest, Word } from 'src/app/interfaces/word.interface';
import { LearnStatisticsService } from 'src/app/services/learn-statistics.service';
import { LearnService } from 'src/app/services/learn.service';
import { TextToSpeechService } from 'src/app/services/text-to-speech.service';
import { WordService } from 'src/app/services/word.service';

@Component({
  selector: 'app-learn-typing-mode',
  templateUrl: './learn-typing-mode.component.html',
  styleUrls: ['./learn-typing-mode.component.css']
})
export class LearnTypingModeComponent implements OnInit {
  //learning word list
  words: Word[] = [];
  //Actual word
  currentWord: Word | null = {} as Word;
  //learning word list count number
  wordListTotalCount: number = 0;
  //Solved learning word list count number
  solvedWordListCount: number = 0;
  //good words
  correctWordListCount: number = 0;
  //bad words
  incorrectWordListCount: number = 0;
  //Learn result in percent
  result: number = 100;

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


  //card text
  cardText?: string | null = '';
  //text long check
  isTextTooLong: boolean = false;

  //while waiting disabled the buttons
  waiting: boolean = false;
  //Error
  serverError: string = '';
  //message
  message: string = '';
  // check message is success or not
  isSuccesssMessage: boolean = false;
  //finished
  isFinished: boolean = false;

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
    this.initLearn();
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
          startLetterNumber = textLength % 2 === 0 || value % 2 ===0  ? value - 1 : value;
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
  CheckTextLong(word: Word | null): boolean {
    return this.learnService.checkTextLong(word, this.settings.isEnglishToHungarian);
  }

  //click the button to check text input
  onClickNextButton() {

    //check by id
    if (this.wordInput === this.searchedWord) {
      this.correctWordListCount++;
      this.isSuccesssMessage = true;
      this.message = this.translate.instant('SelectedCorrectWord');
      this.setNextWord(true);
    }
    else {
      this.incorrectWordListCount++;
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

      this.solvedWordListCount++;
      this.updateUsedWord(isCorrect);
      this.deleteFirstElement();
      this.calculateResult();
      this.setCurrentWord();
      this.CheckCardTextLong(this.currentWord);
      this.setCardText();
      this.waiting = false;
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
}
