import { DropDownListModel } from "../common/interfaces/common.interface";

//List word for learning modes request
export interface ListWordForLearnRequest {
  wordNumber: number;
  wordOrderingType: number;
}

//basic datas to start to learn
export interface LearnSettingsModel {
  wordNumber: number;
  isEnglishToHungarian: boolean;
  wordOrderingType: number;
  learnModeType: number;
}

//Learning mode
export enum LearnModeType {
  //flashcard mode
  Flashcard = 1,
  // you can typing any text
  Typing = 2,
  // you can select more opportunity
  Selection = 3
}

//Word ordering types
export enum WordOrderingType {
  // it can be anything
  Any = 1,
  //starting the newest words
  Newest = 2,
  //starting the oldest words
  Oldest = 3,
  //starting from the best good-bad balance
  Best = 4,
  //starting from the worst good-bad balance
  Worst = 5,
}
