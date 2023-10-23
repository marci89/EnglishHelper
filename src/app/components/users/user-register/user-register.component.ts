import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/common/services/account.service';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({})
  serverError: string = "";

  constructor(
    private accountService: AccountService,
     private toastr: ToastrService,
     private router: Router,
     private translate: TranslateService
     ) { }

  ngOnInit(): void {
		this.initForm();
  }

  //Init form
  initForm() {
    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(4)]),
      confirmPassword: new FormControl('', [Validators.required, this.matchValues('password')]),
      acceptTerms: new FormControl('', Validators.required)
    });

    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    });
  }

  // Password match helper
  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.get(matchTo)?.value ? null : {isMatching: true}
    }
  }

  //User create (registration)
  register() {
    this.accountService.register(this.registerForm.value).subscribe({
      next: _ => {
        this.toastr.success(this.translate.instant('RegisterSuccess'))
        this.router.navigateByUrl('/login');
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
