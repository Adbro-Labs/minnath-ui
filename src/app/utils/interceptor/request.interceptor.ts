import { HttpErrorResponse, HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';

export const requestInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(UsersService);
  const router = inject(Router);

  request = request.clone({
    setHeaders: {
      Authorization: `Bearer ${authService.getAuthToken()}`
    }
  });
  return next(request).pipe(tap(() => {},
      (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status !== 401) {
         return;
        }
        router.navigate(['/login']);
      }
  }));
};
