import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/common/services/account.service';
import { TranslateService } from '@ngx-translate/core';
import { ResetPasswordRequest } from '../../../common/interfaces/account.interface';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup = new FormGroup({})
  resetPasswordRequest: ResetPasswordRequest = {} as ResetPasswordRequest;
  token: string | null | undefined = "";
  serverError: string = "";

  constructor(
    public accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private translate: TranslateService) {

    // Get the token from the query parameter
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  ngOnInit(): void {
    this.initForm();
    this.serverError = "";
  }

  //Init form
  initForm() {
    this.resetPasswordForm = new FormGroup({
      newPassword: new FormControl('', [Validators.required, Validators.minLength(4)]),
      confirmPassword: new FormControl('', [Validators.required, this.matchValues('newPassword')])
    });

    this.resetPasswordForm.controls['newPassword'].valueChanges.subscribe({
      next: () => this.resetPasswordForm.controls['confirmPassword'].updateValueAndValidity()
    });

  }

  // Password match helper
  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.get(matchTo)?.value ? null : { isMatching: true }
    }
  }


  // Save the new password for user
  resetPassword() {
    this.resetPasswordRequest = {
      password: this.resetPasswordForm.controls['newPassword'].value,
      token: this.token as string | undefined
    };

    this.accountService.resetPassword(this.resetPasswordRequest).subscribe({
      next: _ => {
        this.router.navigateByUrl('/login');
        this.toastr.success(this.translate.instant('EditSuccess'))
      },
      error: error => {
        this.serverError = error.error;
      }
    })
  }

  // return login
  cancel() {
    this.router.navigateByUrl('/login');
  }

}

