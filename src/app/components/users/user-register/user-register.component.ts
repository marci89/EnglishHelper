import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/common/account.service';

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
     private router: Router
     ) { }

  ngOnInit(): void {
		this.initializeForm();
  }

  initializeForm() {
    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(4)]),
      confirmPassword: new FormControl('', [Validators.required, this.matchValues('password')])
    });

    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.get(matchTo)?.value ? null : {isMatching: true}
    }
  }

  register() {
    console.log(this.registerForm.value);
    this.accountService.register(this.registerForm.value).subscribe({
      next: response => {
        this.router.navigateByUrl('/words');
      },
      error: error => {
        this.serverError = error.error;

      }
    })
  }

  cancel(){
    this.router.navigateByUrl('/');
  }
}
