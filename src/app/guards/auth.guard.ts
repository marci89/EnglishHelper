import { CanActivateFn } from '@angular/router';
import { AccountService } from '../services/common/account.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toastr = inject(ToastrService);

  return accountService.currentUser$.pipe(
    map(user => {
      if (user) return true
      else {
        toastr.error('request not denied!');
        return false;
      }
    })
  )
};
