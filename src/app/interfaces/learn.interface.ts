
//basic datas to start to learn
export interface LearnSettingsModel {
  //how many words
  wordNumber: number;
  //english-hungarian, hungarian-english
  isEnglishToHungarian: boolean;
  //get words fom server with filter options
  wordOrderingType: number;
  //typing, select, flashcard modes
  learnModeType: number;
  //enable the voice
  enableSound: boolean;
  //allow automatic flip
  enableFlashcardAutomaticFlip: boolean;
  //flipping after this value
  flashcardFlipTimer: number;
  //how many words you can choose from.
  choosableWordNumber: number;
  //how many letters you can see at the end
  numberOfEndLetter: number;
  //how many letters you can see at the begining
  numberOfStartLetter: number;

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
