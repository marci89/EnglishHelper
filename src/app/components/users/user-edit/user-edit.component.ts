import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { LoginUser } from 'src/app/common/interfaces/account.interface';
import { AccountService } from 'src/app/common/services/account.service';
import { UpdateUserRequest, User } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';
import { ModalService } from '../../../common/services/modal.service';
import { ChangePasswordRequest } from '../../../common/interfaces/account.interface';
import { ChangeEmailComponent } from '../change-email/change-email.component';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent {
  loginedUser: LoginUser | null | undefined;
  user: User | null | undefined;
  userProfileForm: FormGroup = new FormGroup({})
  changePasswordForm: FormGroup = new FormGroup({})
  updateUserRequest: UpdateUserRequest = {} as UpdateUserRequest;
  changePasswordRequest: ChangePasswordRequest = {} as ChangePasswordRequest;

  constructor(
    private accountService: AccountService,
    private userService: UserService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private ModalService: ModalService,
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: loginedUser => this.loginedUser = loginedUser
    });
  }

  ngOnInit(): void {
    this.initForms();
    this.readUser();
  }

  // Init all of forms
  initForms() {
    this.userProfileForm = new FormGroup({
      username: new FormControl('', Validators.required)
    });

    this.changePasswordForm = new FormGroup({
      currentPassword: new FormControl('', [Validators.required, Validators.minLength(4)]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(4)]),
      confirmPassword: new FormControl('', [Validators.required, this.matchValues('newPassword')])
    });

    this.changePasswordForm.controls['newPassword'].valueChanges.subscribe({
      next: () => this.changePasswordForm.controls['confirmPassword'].updateValueAndValidity()
    });
  }

  // Password match helper
  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.get(matchTo)?.value ? null : { isMatching: true }
    }
  }

  //Add values for userProfileForm
  addValuesToUserProfileForm() {
    this.userProfileForm.setValue({
      username: this.user?.username
    })
  }

  // Read user by id
  readUser() {
    if (!this.loginedUser) return;

    this.userService.readUserById(this.loginedUser.id).subscribe({
      next: user => {
        this.user = user;
        this.addValuesToUserProfileForm();
      },
      error: error => {
        this.toastr.error(this.translate.instant(error.error))
      }
    })
  }

  //Update user
  updateUser() {
    if (!this.loginedUser) return;

    this.updateUserRequest = {
      id: this.loginedUser.id,
      username: this.userProfileForm.controls['username'].value,
    };

    this.userService.updateUser(this.updateUserRequest).subscribe({
      next: _ => {
        this.toastr.success(this.translate.instant('EditSuccess'))
      },
      error: error => {
        this.toastr.error(this.translate.instant(error.error))
      }
    })
  }

  //Change email popup
  changeEmail() {
    this.ModalService.openDialog(ChangeEmailComponent, 30);
  }

  // change password
  changePassword() {
    this.changePasswordRequest = {
      password : this.changePasswordForm.controls['currentPassword'].value,
      newPassword: this.changePasswordForm.controls['newPassword'].value,
    };

    this.accountService.changePassword(this.changePasswordRequest).subscribe({
      next: _ => {
        this.toastr.success(this.translate.instant('EditSuccess'))
        this.changePasswordForm.reset();
      },
      error: error => {
        this.toastr.error(this.translate.instant(error.error))
      }
    })
  }
}
