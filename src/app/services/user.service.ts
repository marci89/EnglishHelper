import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ListUserWithFilterRequest, User } from '../interfaces/user.interface';
import { map } from 'rxjs';
import { PagedList, PaginatedResult } from '../common/interfaces/pagination.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  //User list filter initalization
  InitUserListFilter(): ListUserWithFilterRequest {
    return {
      username: "",
      email: "",
      pageNumber: 1,
      pageSize: 5,
      fieldName: "username",
      isDescending: true
    };
  }
  //Get users with filter
  getUsers(request: ListUserWithFilterRequest) {
    const params = new HttpParams()
      .set('pageNumber', request.pageNumber.toString())
      .set('pageSize', request.pageSize.toString())
      .set('username', request.username.toString())
      .set('email', request.email.toString())
      .set('fieldName', request.fieldName.toString())
      .set('isDescending', request.isDescending.toString());

    return this.http.get<PagedList<User>>(`${this.baseUrl}users`, { params }).pipe(
      map((response: PagedList<User>) => this.mapPagedListToPaginatedResult(response))
    );
  }

  //Generic PagedList to PaginatedResult mapper
  private mapPagedListToPaginatedResult<T>(response: PagedList<T>): PaginatedResult<T> {
    return {
      result: response.items,
      pagination: {
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        itemsPerPage: response.pageSize,
        totalItems: response.totalCount,
      },
    };
  }
}
