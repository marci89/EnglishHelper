import { CanActivateFn } from '@angular/router';
import { AccountService } from '../services/account.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toastr = inject(ToastrService);
  const translate = inject(TranslateService);

  return accountService.currentUser$.pipe(
    map(user => {
      if (user) return true
      else {
        translate.get('AccessDenied').subscribe((res: string) => {
        toastr.error(translate.instant(res));
        });

        return false;
      }
    })
  )
};
