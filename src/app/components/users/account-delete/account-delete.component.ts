import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DeleteAccountRequest } from 'src/app/common/interfaces/account.interface';
import { AccountService } from 'src/app/common/services/account.service';
import { ModalService } from 'src/app/common/services/modal.service';

@Component({
  selector: 'app-account-delete',
  templateUrl: './account-delete.component.html',
  styleUrls: ['./account-delete.component.css']
})
export class AccountDeleteComponent implements OnInit {
  deleteAccountForm: FormGroup = new FormGroup({})
  deleteAccountRequest: DeleteAccountRequest = {} as DeleteAccountRequest;

  serverError: string = "";

  constructor(
    private accountService: AccountService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private modalService: ModalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  // Init form
  initForm() {
    this.deleteAccountForm = new FormGroup({
      identifier: new FormControl('',Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(4)]),
    });
  }

  //Delete account
  deleteAccount() {
    this.deleteAccountRequest = {
      identifier: this.deleteAccountForm.controls['identifier'].value,
      password: this.deleteAccountForm.controls['password'].value
    };

    this.accountService.deleteAccount(this.deleteAccountRequest).subscribe({
      next: _ => {
        this.toastr.success(this.translate.instant('DeleteProfileSuccess'))
        this.accountService.logout();
        this.modalService.close();
        this.router.navigateByUrl('/home');
      },
      error: error => {
        this.serverError = error.error;
      }
    })
  }

  // close teh dialog modal
  cancel() {
    this.modalService.close();
  }
}
