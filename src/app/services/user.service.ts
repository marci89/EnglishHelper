import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ListUserWithFilterRequest, User } from '../interfaces/user.interface';
import { map } from 'rxjs';
import { PagedList, PaginatedResult, PaginationRequest } from '../common/interfaces/pagination.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;
  paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>;

  constructor(private http: HttpClient) { }

  getUsers(request: ListUserWithFilterRequest) {
    const params = new HttpParams()
      .set('pageNumber', request.pageNumber.toString())
      .set('pageSize', request.pageSize.toString())
      .set('username', request.username.toString())
      .set('email', request.email.toString());

    return this.http.get<PagedList<User>>(`${this.baseUrl}users`, { params }).pipe(
      map((response: PagedList<User>) => this.mapPagedListToPaginatedResult(response))
    );
  }

  private mapPagedListToPaginatedResult<T>(response: PagedList<T>): PaginatedResult<T> {
    return {
      result: response.items ?? [],
      pagination: {
        currentPage: response.currentPage ?? 0,
        totalPages: response.totalPages ?? 0,
        itemsPerPage: response.pageSize ?? 0,
        totalItems: response.totalCount ?? 0,
      },
    };
  }
}
