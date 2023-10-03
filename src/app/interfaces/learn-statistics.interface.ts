import { LearnModeType } from "./learn.interface";

//Create learn statistics server request
export interface CreateLearnStatisticsRequest {
  //Good counts
  correctCount: number;
  //Bad counts
  incorrectCount: number;
  //Result percent
  result: number;
  //Learn mode
  LearnMode: LearnModeType;
}

//Learn statistics
export interface LearnStatistics {
  //identifier
  id: number;
  //User id
  userId: number;
  //Good counts
  correctCount: number;
  //Bad counts
  incorrectCount: number;
  //Result percent
  result: number;
  //Learn mode
  LearnMode: LearnModeType;
  //creation date
  created: Date;
  //all count (good+bad)
  allCount: number
}
