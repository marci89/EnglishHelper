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

  readUserById(id: number) {
    return this.http.get<User>(this.baseUrl + 'users/' + id);
  }

  //Get users with filter
  ListUser(request: ListUserWithFilterRequest) {
    const params = this.createParams(request);

    return this.http.get<PagedList<User>>(this.baseUrl + 'users', { params }).pipe(
      map((response: PagedList<User>) => this.mapPagedListToPaginatedResult(response))
    );
  }

  //Update user's name
  updateUser(request: UpdateUserRequest) {
    return this.http.put(this.baseUrl + 'users', request);
  }

  //Delete user by id
  deleteUserById(id: number) {
    return this.http.delete(`${this.baseUrl}users/${id}`);
  }
}
