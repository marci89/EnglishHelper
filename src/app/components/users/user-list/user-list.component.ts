import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Pagination, PaginationRequest } from 'src/app/common/interfaces/pagination.interface';
import { ListUserWithFilterRequest, User } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] | undefined = [];
  pagination: Pagination | undefined;
  filter: ListUserWithFilterRequest = {
    username: "",
    email: "",
    pageNumber: 1,
    pageSize: 3
  };

  private userSubscription: Subscription | undefined;

  constructor(private userService: UserService, private toastr: ToastrService,  private translate: TranslateService) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userSubscription = this.userService.getUsers(this.filter).subscribe({
      next: response => {
        this.users = response.result;
        this.pagination = response.pagination
      },
      error: error => {
        this.toastr.error(this.translate.instant(error))
      }
    })
  }

  resetFilters() {
   this.filter.username = "";
   this.filter.email = "";
    this.getUsers();
  }

  pageChanged(event: any) {
    if (this.filter.pageNumber !== event.page) {
      this.filter.pageNumber = event.page;
      this.getUsers();
    }
  }


  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

}
