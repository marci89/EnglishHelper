import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { DropDownListModel } from 'src/app/common/interfaces/common.interface';
import { LearnModeType, LearnSettingsModel, ListWordForLearnRequest, WordOrderingType } from 'src/app/interfaces/learn.interface';
import { Word } from 'src/app/interfaces/word.interface';
import { LearnService } from 'src/app/services/learn.service';
import { WordService } from 'src/app/services/word.service';

@Component({
  selector: 'app-learn-settings',
  templateUrl: './learn-settings.component.html',
  styleUrls: ['./learn-settings.component.css']
})
export class LearnSettingsComponent implements OnInit, OnDestroy {
  words: Word[] = [];

  //dropdownlists
  wordOrderingTypes: DropDownListModel[] = [];
  selectedOrder: number = 1;
  learnModeTypes: DropDownListModel[] = [];
  selectedLearnMode: number = 1;

  serviceRequest: ListWordForLearnRequest = {} as ListWordForLearnRequest;
  model: LearnSettingsModel = {} as LearnSettingsModel;

  wordListSubscription$: Subscription | undefined;

  constructor(
    private wordService: WordService,
    private toastr: ToastrService,
    private router: Router,
    private translate: TranslateService,
    private learnService: LearnService

  ) { }

  ngOnInit() {
    this.initLearnModeTypes();
    this.initWordOrderingTypes();

    //subscribe word list to know the words counts
    this.wordListSubscription$ = this.wordService.wordList$.subscribe({
      next: words => {
        this.words = words ?? [];
        this.initSettingsModel();
      }
    });

    this.listWord();
  }

  //init word order type dropdown list
  initWordOrderingTypes() {
    for (const key in WordOrderingType) {
      if (!isNaN(Number(key))) {
        this.wordOrderingTypes.push({
          label: WordOrderingType[key],
          value: +key,
        });
      }
    }
  }

  //init word order type dropdown list
  initLearnModeTypes() {
    for (const key in LearnModeType) {
      if (!isNaN(Number(key))) {
        this.learnModeTypes.push({
          label: LearnModeType[key],
          value: +key,
        });
      }
    }
  }

  //Settings model initalization
  initSettingsModel() {
    this.model.wordNumber = this.words.length;
    this.model.isEnglishToHungarian = true;
  }

  // list words from server
  listWord() {
    this.wordService.list().subscribe({
      next: _ => { },
      error: error => {
        this.toastr.error(this.translate.instant(error.error))
      }
    })
  }

  //start learning
  start() {
    this.model.wordOrderingType = this.selectedOrder;
    this.model.learnModeType = this.selectedLearnMode;

    this.learnService.setLearnSettings(this.model);
    this.routeBasedOnEnum(this.selectedLearnMode)
  }


  //Routing depends on LearnModeType
  routeBasedOnEnum(enumValue: LearnModeType) {
    switch (enumValue) {
      case LearnModeType.Flashcard:
        this.router.navigate(['learn-flashcard']);
        break;
      case LearnModeType.Typing:
        this.router.navigate(['learn-typing']);
        break;
      case LearnModeType.Selection:
        this.router.navigate(['learn-selection']);
        break;
      default:
        this.router.navigate(['learn-flashcard']);
        break;
    }
  }

  ngOnDestroy() {
    if (this.wordListSubscription$) {
      this.wordListSubscription$.unsubscribe();
    }
  }
}
