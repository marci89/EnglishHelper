import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { LearnService } from 'src/app/services/learn.service';
import { TextToSpeechService } from 'src/app/services/text-to-speech.service';
import { WordService } from 'src/app/services/word.service';
import { LearnStatisticsService } from '../../../services/learn-statistics.service';
import { LearnModeBaseComponent } from '../learn-mode-base/learn-mode-base.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-learn-flashcard-mode',
  templateUrl: './learn-flashcard-mode.component.html',
  styleUrls: ['./learn-flashcard-mode.component.css'],
  animations: [
    //change language text (flip animation)
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
export class LearnFlashcardModeComponent extends LearnModeBaseComponent implements OnInit, OnDestroy {

  //flashcard
  flip: string = 'english';

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
          this.setFlashCard();
          this.wordListTotalCount = words.length;
        }
      }
    });

    this.initLearn();
  }

  //set the current word to next from the words list
  setCurrentWord() {
    if (this.words && this.words.length > 0) {
      this.currentWord = this.words[0];

      if (this.settings.isEnglishToHungarian)
        this.speak();
    } else {
      //create static about the result
      this.createLearnStatistics();
      //end of the learn
      this.isFinished = true;
    }

    //automatic flip
    if (this.settings.enableFlashcardAutomaticFlip) {
      this.waiting = true;
      setTimeout(() => {
        if (!this.settings.isEnglishToHungarian)
          this.speak();

        this.toggleFlashcard();
        this.waiting = false;
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
    if (this.flip === 'english')
      this.speak();

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
    this.correctWordCount++;
    this.setNextWord(true);
  }

  //Bad button click
  incorrect() {
    this.incorrectWordCount++
    this.setNextWord(false);
  }

  // Common logic for both button clicks
  setNextWord(isCorrect: boolean) {
    if (this.currentWord) {
      this.currentWord.englishText = "";
      this.currentWord.hungarianText = "";
    }

    if (!this.settings.enableFlashcardAutomaticFlip)
      this.waiting = true;

    this.setFlashCard();

    // set timeout because of flipping
    setTimeout(() => {

      this.solvedWordCount++;
      this.updateUsedWord(isCorrect);
      this.deleteFirstElement();
      this.calculateResult();
      this.setCurrentWord();
      this.setTextsmaller();
      if (!this.settings.enableFlashcardAutomaticFlip)
        this.waiting = false;

    }, 300);
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
