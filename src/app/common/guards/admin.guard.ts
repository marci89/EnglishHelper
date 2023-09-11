import { CanActivateFn } from '@angular/router';
import { AccountService } from '../services/account.service';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

//Allow only admin role for route
export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toastr = inject(ToastrService);
  const translate = inject(TranslateService);

  return accountService.currentUser$.pipe(
    map(user => {
      if (!user) return false;
      if (user.role === "Admin") {
        return true;
      } else {
        translate.get('AccessDenied').subscribe((res: string) => {
          toastr.error(translate.instant(res));
          });

        return false;
      }
    })
  )
};
