import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/common/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const toastr = inject(ToastrService);

  return authService.currentUser$.pipe(
    map(user => {
      if (user) return true
      else {
        toastr.error('request not denied!');
        return false;
      }
    })
  )
};
