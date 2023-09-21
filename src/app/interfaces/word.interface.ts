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
