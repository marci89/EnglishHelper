import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ListUserWithFilterRequest, UpdateUserRequest, User } from '../interfaces/user.interface';
import {map } from 'rxjs';
import { PagedList } from '../common/interfaces/pagination.interface';
import { BaseService } from '../common/services/base.service';

//User service
@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {

  constructor(private http: HttpClient) {
    super();
   }

  //User list filter initalization
  InitUserListFilter(): ListUserWithFilterRequest {
    return {
      username: "",
      email: "",
      pageNumber: 1,
      pageSize: 10,
      fieldName: "username",
      isDescending: true
    };
  }

  readById(id: number) {
    return this.http.get<User>(this.baseUrl + 'user/' + id);
  }

  //Get users with filter
  list(request: ListUserWithFilterRequest) {
    const params = this.createParams(request);

    return this.http.get<PagedList<User>>(this.baseUrl + 'user/list', { params }).pipe(
      map((response: PagedList<User>) => this.mapPagedListToPaginatedResult(response))
    );
  }

  //Update user's name
  update(request: UpdateUserRequest) {
    return this.http.put(this.baseUrl + 'user', request);
  }

  //Delete user by id
  delete(id: number) {
    return this.http.delete(`${this.baseUrl}user/${id}`);
  }
}
