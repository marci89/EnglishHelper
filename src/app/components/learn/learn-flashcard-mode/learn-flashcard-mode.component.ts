import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { LearnSettingsModel } from 'src/app/interfaces/learn.interface';
import { ListWordWithFilter, UpdateUsedWordRequest, Word } from 'src/app/interfaces/word.interface';
import { LearnService } from 'src/app/services/learn.service';
import { TextToSpeechService } from 'src/app/services/text-to-speech.service';
import { WordService } from 'src/app/services/word.service';
import { CreateLearnStatisticsRequest } from '../../../interfaces/learn-statistics.interface';
import { LearnStatisticsService } from '../../../services/learn-statistics.service';

@Component({
  selector: 'app-learn-flashcard-mode',
  templateUrl: './learn-flashcard-mode.component.html',
  styleUrls: ['./learn-flashcard-mode.component.css'],
  animations: [
    //change language text
    trigger('flipState', [
      state('hungarian', style({
        transform: 'rotateY(179deg)'
      })),
      state('english', style({
        transform: 'rotateY(0)'
      })),
      transition('hungarian => english', animate('500ms ease-out')),
      transition('english => hungarian', animate('500ms ease-in'))
    ]),
  ]
})
export class LearnFlashcardModeComponent implements OnInit {
  //learning word list
  words: Word[] = [];
  //Actual word
  currentWord: Word | null = {} as Word;
  //learning word list count number
  wordListTotalCount: number = 0;
  //Solved learning word list count number
  solvedWordListCount: number = 0;

  //Error
  serverError: string = '';

  //Learn result in percent
  result: number = 100;
  //good words
  correctWordListCount: number = 0;
  //bad words
  incorrectWordListCount: number = 0;

  //flashcard
  flip: string = '';

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
    const serviceRequest: ListWordWithFilter = {
      userId: 0,
      wordNumber: this.settings.wordNumber,
      orderType: this.settings.wordOrderingType,
    };

    this.wordService.listWithFilter(serviceRequest).subscribe({
      next: words => {
        this.words = words;

        //check the word count
        if (this.words && this.words.length > 0) {
          this.setFlashCard();
          this.learnService.shuffleArray(this.words);
          this.setCurrentWord();
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

  //set the current word to next from the words list
  setCurrentWord() {
    if (this.words && this.words.length > 0) {
      this.currentWord = this.words[0];
      this.speak();
    } else {
      //create static about the result
      this.CreateLearnStatistics();
      //end of the learn
      this.isFinished = true;
    }

    //automatic flip
    if (this.settings.enableFlashcardAutomaticFlip) {
      setTimeout(() => {
        this.toggleFlashcard();
      }, this.settings.flashcardFlipTimer * 1000);
    }
  }

  //Set the flashcard at the begining
  setFlashCard() {
    this.flip = this.settings.isEnglishToHungarian ? 'english' : 'hungarian'
    this.setTextsmaller();
  }

  //toggle flashcard
  toggleFlashcard() {
    this.flip = (this.flip == 'english') ? 'hungarian' : 'english';
    this.setTextsmaller();
  }

  //check smaller font-size if you have longer word
  isTextTooLongValidator(text: string) {
    this.isTextTooLong = text.length > 100;
  }

  //set smaller font-size if you have longer word
  setTextsmaller() {
    this.flip === 'english'
      ? this.isTextTooLongValidator(this.currentWord?.englishText ?? '')
      : this.isTextTooLongValidator(this.currentWord?.hungarianText ?? '');
  }

  //Good button click
  correct() {
    this.correctWordListCount++;
    this.setNextWord(true);
  }

  //Bad button click
  incorrect() {
    this.incorrectWordListCount++
    this.setNextWord(false);
  }

  // Common logic for both button clicks
  setNextWord(isCorrect: boolean) {
    if (this.currentWord) {
      this.currentWord.englishText = "";
      this.currentWord.hungarianText = "";
    }

    this.setFlashCard();

    // set timeout because of flipping
    setTimeout(() => {
      this.solvedWordListCount++;
      this.updateUsedWord(isCorrect);
      this.deleteFirstElement();
      this.calculateResult();
      this.setCurrentWord();
      this.setTextsmaller();
    }, 300);
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
      const text = this.flip === 'english' ? this.currentWord?.englishText : this.currentWord?.hungarianText;
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
      userId: 0,
      correctCount: this.correctWordListCount,
      incorrectCount: this.incorrectWordListCount,
      result: this.result,
      LearnMode: this.settings.learnModeType
    };

    this.learnStatisticsService.create(serviceRequest).subscribe({})
  }
}
