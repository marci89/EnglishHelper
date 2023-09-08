import { Component, ComponentFactoryResolver, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Pagination } from 'src/app/common/interfaces/pagination.interface';
import { ListUserWithFilterRequest, User } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  pagination: Pagination = {} as Pagination;
  filter: ListUserWithFilterRequest = {} as ListUserWithFilterRequest;
  private userSubscription: Subscription | undefined;

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.filter = this.userService.InitUserListFilter();
    this.getUsers();
  }

  getUsers() {
    this.userSubscription = this.userService.getUsers(this.filter).subscribe({
      next: response => {
        this.users = response.result;
        this.pagination = response.pagination;
      },
      error: error => {
        this.toastr.error(this.translate.instant(error.error))
      }
    })
  }

  resetFilters() {
    this.filter.username = "";
    this.filter.email = "";
    this.getUsers();
  }

  onPageChanged(event: any) {
    event.page++;
    this.filter.pageNumber = event.page;
    this.filter.pageSize = event.rows
    this.getUsers();
  }

  onSortChanged(event: any) {
  const order = event.order === -1;
    if (this.filter.fieldName === event.field &&  this.filter.isDescending === order) return;

    this.filter.fieldName = event.field;
    this.filter.isDescending = order;
    this.getUsers();
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
