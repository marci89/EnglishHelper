//Word model
export interface Word {
  id: number;
  userId: number;
  englishText: string;
  hungarianText: string;
  correctCount: number;
  incorrectCount: number;
  created: Date;
  lastUse: Date;
  balance: number;
}

//Request for word create
export interface CreatewordRequest {
  userId: number;
  englishText: string;
  hungarianText: string;
}

//Request for word update
export interface UpdateWordRequest {
  id: number;
  userId: number;
  englishText: string;
  hungarianText: string;
  correctCount: number;
  incorrectCount: number;
}

//List word for learning modes request
export interface ListWordWithFilter {
  userId: number;
  wordNumber: number;
  orderType: number;
}

//Update used word when learning
export interface UpdateUsedWordRequest {
  id: number;
  isCorrect: boolean;
}
