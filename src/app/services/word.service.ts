import { Injectable } from '@angular/core';
import { BaseService } from '../common/services/base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map, of, switchMap } from 'rxjs';
import { CreatewordRequest, UpdateWordRequest, Word } from '../interfaces/word.interface';

//Word service
@Injectable({
  providedIn: 'root'
})

export class WordService extends BaseService {

  //Word list subject
  private WordListSource = new BehaviorSubject<Word[] | null>(null);
  wordList$ = this.WordListSource.asObservable();

  constructor(private http: HttpClient) {
    super();
  }

  //Read word by id
  readById(id: number) {
    return this.http.get<Word>(this.baseUrl + 'word/' + id);
  }

  //Get words with userId
  list() {
    return this.http.get<Word[]>(this.baseUrl + 'word/list').pipe(
      map(words => {
        if (words) {
          this.WordListSource.next(words);
        }
      })
    )
  }

  //Create word and add to the subject
  create(request: CreatewordRequest) {
    return this.http.post<Word>(this.baseUrl + 'word', request).pipe(
      map((createdWord: Word) => {
        const currentWords = this.WordListSource.value || [];
        this.WordListSource.next([...currentWords, createdWord]);
      })
    );
  }

  // Update word and update it in the subject, too
  update(request: UpdateWordRequest) {
    return this.http.put<Word>(this.baseUrl + 'word', request).pipe(
      switchMap((updatedWord: Word) => {
        const currentWords = this.WordListSource.value || [];
        const updatedWords = currentWords.map(word => {
          if (word.id === updatedWord.id) {
            return updatedWord;
          }
          return word;
        });
        this.WordListSource.next(updatedWords);
        return of(updatedWord);
      })
    );
  }

  // Delete word by id and delete it from subject, too
  delete(id: number) {
    return this.http.delete(`${this.baseUrl}word/${id}`).pipe(
      map(() => {
        const currentWords = this.WordListSource.value || [];
        const updatedWord = currentWords.filter(word => word.id !== id);
        this.WordListSource.next(updatedWord);
      })
    );
  }

  // Delete all word
  deleteAll() {
    return this.http.delete(`${this.baseUrl}word/deleteAll`).pipe(
      map(() => {
        this.WordListSource.next(null);
      })
    );
  }

  //Reset all word's CorrectCount and IncorrectCount property to 0
  resetResults() {
    return this.http.put<Word[]>(this.baseUrl + 'word/resetResults', "").pipe(
      map(words => {
        if (words) {
          this.WordListSource.next(words);
        }
      })
    )
  }

  /// Export word list to txt file response
  exportWordListToTextFile(): Observable<Blob> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Blob>(`${this.baseUrl}word/ExportWordListToTextFile`, "", {
      headers,
      responseType: 'blob' as 'json', // Set the response type to Blob
    });
  }

  // Export word list to Excel file response
  exportWordListToExcelFile(): Observable<Blob> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Blob>(`${this.baseUrl}word/ExportWordListToExcelFile`, "", {
      headers,
      responseType: 'blob' as 'json', // Set the response type to Blob
    });
  }

}
