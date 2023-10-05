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

//list learn statistics for chart server request
export interface ListLearnStatisticsChartRequest {
  //quantity
  quantity: number;
}

//learn statistics response for chart
export interface LearnStatisticsChart {
  // Label list for chart diagram
  chartLabel: string[];
  //Flashcard chart data
  flashcardChartData: string[];
  //TypingChartData chart data
  typingChartData: string[];
  //SelectionChartData chart data
  selectionChartData: string[];
  //ListeningChartData chart data
  listeningChartData: string[];
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
  learnMode: LearnModeType;
  //creation date
  created: Date;
  //all count (good+bad)
  allCount: number
}
