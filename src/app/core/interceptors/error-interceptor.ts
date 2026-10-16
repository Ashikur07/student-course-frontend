import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification'; // অথবা '../services/notification.service'

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMsg = 'Something went wrong! Please try again.';

      if (error.error && error.error.message) {
        errorMsg = error.error.message; // Spring Boot-এর কাস্টম মেসেজ
      } else if (error.status === 0) {
        errorMsg = 'Cannot connect to backend server (port 8080).';
      }

      notification.showError(errorMsg);
      return throwError(() => error);
    })
  );
};