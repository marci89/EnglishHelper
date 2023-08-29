import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest } from 'src/app/interfaces/user-interface';
import { AuthService } from 'src/app/services/common/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  loginRequest: LoginRequest = {} as LoginRequest;

  constructor(public authService: AuthService, private router: Router) { }

  login() {
    this.authService.login(this.loginRequest).subscribe({
      next: _ => {
        this.router.navigateByUrl('/words');
      }
    })
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl("/");
  }

}
