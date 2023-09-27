import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/common/services/account.service';
import { ChangeEmailRequest } from '../../../common/interfaces/account.interface';
import { ModalService } from '../../../common/services/modal.service';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.css']
})
export class ChangeEmailComponent implements OnInit {
  changeEmailForm: FormGroup = new FormGroup({})
  changeEmailRequest: ChangeEmailRequest = {} as ChangeEmailRequest;

  serverError: string = "";

  constructor(
    private accountService: AccountService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  // Init form
  initForm() {
    this.changeEmailForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(4)]),
    });
  }

  //Change email
  changeEmail() {
    this.changeEmailRequest = {
      email: this.changeEmailForm.controls['email'].value,
      password: this.changeEmailForm.controls['password'].value
    };

    this.accountService.changeEmail(this.changeEmailRequest).subscribe({
      next: _ => {
        this.toastr.success(this.translate.instant('EditSuccess'))
        this.accountService.updateCurrentUser('email', this.changeEmailRequest.email);
        this.modalService.close();
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
