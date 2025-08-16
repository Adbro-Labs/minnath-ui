import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

export const authGuard: CanActivateFn = () => {
  const userService = inject(UsersService);
  const router = inject(Router);
  const authToken = userService.getAuthToken();
  if (authToken || true) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
