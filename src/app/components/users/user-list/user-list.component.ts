import { Component, OnDestroy, OnInit} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Pagination } from 'src/app/common/interfaces/pagination.interface';
import { ListUserWithFilterRequest, User } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';
import { ModalService } from '../../../common/services/modal.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  pagination: Pagination = {} as Pagination;
  filter: ListUserWithFilterRequest = {} as ListUserWithFilterRequest;
  private listUserSubscription$: Subscription | undefined;

  tableSize: any = 'p-datatable-sm';

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.filter = this.InitUserListFilter();
    this.listUser();
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

  // list paginated users from server
  listUser() {
    this.listUserSubscription$ = this.userService.ListUser(this.filter).subscribe({
      next: response => {
        this.users = response.result;
        this.pagination = response.pagination;
      },
      error: error => {
        this.toastr.error(this.translate.instant(error.error))
      }
    })
  }

  // Opening delete confirmation dialog to handle delete action
  openDeleteConfirmation(id: number, username: string) {
    this.modalService.openDeleteConfirmation(id, username, this.deleteUserById.bind(this));
  }

  // deleting user by id
  public deleteUserById(id: number) {
  this.userService.deleteUserById(id).subscribe({
      next: _ => {
        this.toastr.success(this.translate.instant('DeleteSuccess'))
        this.listUser();
      },
      error: error => {
        this.toastr.error(this.translate.instant(error.error))
      }
    })
  }

  // reseting filter inputs
  resetFilters() {
    this.filter.username = "";
    this.filter.email = "";
    this.listUser();
  }

  // paginating change handler
  onPageChanged(event: any) {
    event.page++;
    this.filter.pageNumber = event.page;
    this.filter.pageSize = event.rows
    this.listUser();
  }

  // sorting change handler
  onSortChanged(event: any) {
    const order = event.order === -1;
    if (this.filter.fieldName === event.field && this.filter.isDescending === order) return;

    this.filter.fieldName = event.field;
    this.filter.isDescending = order;
    this.listUser();
  }

  ngOnDestroy() {
    if (this.listUserSubscription$) {
      this.listUserSubscription$.unsubscribe();
    }
  }
}
