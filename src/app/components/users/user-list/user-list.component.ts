import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Pagination, PaginationRequest } from 'src/app/common/interfaces/pagination.interface';
import { User } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] | undefined = [];
  pagination: Pagination | undefined;
  paginationRequest: PaginationRequest = {
    pageNumber: 1,
    pageSize: 3
  };

  private userSubscription: Subscription | undefined;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userSubscription = this.userService.getUsers(this.paginationRequest).subscribe({
      next: response => {
        this.users = response.result;
        this.pagination = response.pagination
      },
      error: error => {
        console.error('Error fetching users:', error);
      }
    })
  }

  pageChanged(event: any) {
    if (this.paginationRequest.pageNumber !== event.page) {
      this.paginationRequest.pageNumber = event.page;
      this.getUsers();
    }
  }


  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

}
