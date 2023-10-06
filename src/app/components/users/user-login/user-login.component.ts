import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/common/services/account.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {
  loginForm: FormGroup = new FormGroup({})
  serverError: string = "";

  constructor(
    public accountService: AccountService,
    private router: Router,
    private toastr: ToastrService) { }

    ngOnInit(): void {
      this.initForm();
    }

    //Init form
    initForm() {
      this.loginForm = new FormGroup({
        identifier: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
      });
    }


  // Login
  login() {
    this.accountService.login(this.loginForm.value).subscribe({
      next: _ => {
        this.router.navigateByUrl('/words');
      },
      error: error => {
        this.serverError = error.error;
      }
    })
  }

    // return home
    cancel(){
      this.router.navigateByUrl('/');
    }
}
