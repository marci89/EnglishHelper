import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  return authService.currentUser$.pipe(
    map(user => {
      if (user) return true
      else {
        return false;
      }
    })
  )
};
