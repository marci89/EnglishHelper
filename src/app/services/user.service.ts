import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user.interface';
import { PaginatedResult, PaginationRequest } from '../interfaces/common/common.interface';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;
  paginatedResult : PaginatedResult<User[]> = new PaginatedResult<User[]>;

  constructor(private http: HttpClient) { }

  getUsers(request: PaginationRequest): Observable<PaginatedResult<User[]>> {
    const params = new HttpParams()
      .set('pageNumber', request.pageNumber.toString())
      .set('pageSize', request.pageSize.toString());

      return this.http.get<PaginatedResult<User[]>>(`${this.baseUrl}users`, { params }).pipe(
        map((response : any) => {
          return {
            result: response.items,
            pagination: {
              currentPage: response.currentPage,
              totalPages: response.totalPages,
              itemsPerPage: response.pageSize,
              totalItems: response.totalCount,
            },
          };
        })
      );
    }
  }
