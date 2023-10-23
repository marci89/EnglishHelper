import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/common/services/account.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup = new FormGroup({})
  serverError: string = "";

  constructor(
    public accountService: AccountService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.serverError = "";
    this.initForm();
  }

  //Init form
  initForm() {
    this.forgotPasswordForm = new FormGroup({
      identifier: new FormControl('', Validators.required),
    });
  }

  // sending an email and after click the link on there and the reset password view will be visible
  resetPassword() {
    this.accountService.forgotPassword(this.forgotPasswordForm.value).subscribe({
      next: _ => {
        this.toastr.success(this.translate.instant('SendResetPasswordEmailSuccess'))
        this.serverError = "";
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
