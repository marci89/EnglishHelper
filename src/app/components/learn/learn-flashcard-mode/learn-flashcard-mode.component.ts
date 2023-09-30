import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { LearnSettingsModel } from 'src/app/interfaces/learn.interface';
import { ListWordWithFilter, UpdateUsedWordRequest, Word } from 'src/app/interfaces/word.interface';
import { LearnService } from 'src/app/services/learn.service';
import { TextToSpeechService } from 'src/app/services/text-to-speech.service';
import { WordService } from 'src/app/services/word.service';

@Component({
  selector: 'app-learn-flashcard-mode',
  templateUrl: './learn-flashcard-mode.component.html',
  styleUrls: ['./learn-flashcard-mode.component.css'],
  animations: [
    trigger('flipState', [
      state('hungarian', style({
        transform: 'rotateY(179deg)'
      })),
      state('english', style({
        transform: 'rotateY(0)'
      })),
      transition('hungarian => english', animate('500ms ease-out')),
      transition('english => hungarian', animate('500ms ease-in'))
    ])
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
  isFinished : boolean = false;

  learnSettings: LearnSettingsModel = {} as LearnSettingsModel;

  constructor(
    private wordService: WordService,
    private toastr: ToastrService,
    private router: Router,
    private translate: TranslateService,
    private learnService: LearnService,
    private textToSpeechService: TextToSpeechService

  ) { }


  ngOnInit() {
    this.initLearn();
  }

  //Set all of variables to start the learning
  initLearn() {
    //get settings options
    this.learnSettings = this.learnService.readLearnSettings();
    //list learning words (filtered by settings option)
    this.listWord();

  }

  // list filtered words
  listWord() {
    // Initialize the serviceRequest object
    const serviceRequest: ListWordWithFilter = {
      userId: 0,
      wordNumber: this.learnSettings.wordNumber,
      orderType: this.learnSettings.wordOrderingType,
    };

    this.wordService.listWithFilter(serviceRequest).subscribe({
      next: words => {
        this.words = words;

        //check the word count
        if (this.words && this.words.length > 0) {
          this.setFlashCard();
          this.setCurrentWord()
          this.wordListTotalCount = words.length;
        } else {
          this.serverError = "NoWordList";
        }
      },
      error: error => {
        this.toastr.error(this.translate.instant(error.error))
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
      this.isFinished = true;
    }
  }

  //Set the flashcard at the begining
  setFlashCard() {
    this.flip = this.learnSettings.isEnglishToHungarian ? 'english' : 'hungarian'
  }

  //toggle flashcard
  toggleFlashcard() {
    this.flip = (this.flip == 'english') ? 'hungarian' : 'english';
  }

  //Good button click
  correct() {
    this.setFlashCard();
    this.correctWordListCount++;
    this.solvedWordListCount++;
    this.updateUsedWord(true);
    this.deleteFirstElement();
    this.calculateResult();
    this.setCurrentWord();

  }

  //Bad button click
  incorrect() {
    this.setFlashCard();
    this.incorrectWordListCount++
    this.solvedWordListCount++;
    this.updateUsedWord(false);
    this.deleteFirstElement();
    this.calculateResult();
    this.setCurrentWord();
  }

  //Delete the first element from word list array
  deleteFirstElement() {
    if (this.words && this.words.length > 0) {
      this.words.shift();
    }
  }
    //speak the word
    speak() {
      const text = this.flip === 'english' ? this.currentWord?.englishText : this.currentWord?.hungarianText;
      this.textToSpeechService.speak(text ?? '');
    }

    //Calculate the result in percentage
    calculateResult() {
      const percentage = (this.correctWordListCount / this.solvedWordListCount) * 100;
      this.result = parseFloat(percentage.toFixed(2));
    }
  }
