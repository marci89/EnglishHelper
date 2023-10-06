import { Injectable } from '@angular/core';
import { BaseService } from '../common/services/base.service';
import { HttpClient } from '@angular/common/http';
import { LearnSettingsModel } from '../interfaces/learn.interface';
import { Word } from '../interfaces/word.interface';

@Injectable({
  providedIn: 'root'
})
export class LearnService extends BaseService {

  //private learn settings model object
  private learnSettings: LearnSettingsModel = {} as LearnSettingsModel;


  constructor(private http: HttpClient) {
    super();
  }

  //Read settings
  readLearnSettings() {
    return this.learnSettings;
  }

  //update settings
  setLearnSettings(request: LearnSettingsModel) {
    this.learnSettings = request;
  }
}
