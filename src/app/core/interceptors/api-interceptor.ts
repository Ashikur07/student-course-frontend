import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  // যদি URL-এ http না থাকে, তবে সামনে environment.apiUrl যুক্ত করবে
  if (!req.url.startsWith('http')) {
    const apiReq = req.clone({
      url: `${environment.apiUrl}${req.url.startsWith('/') ? '' : '/'}${req.url}`,
    });
    return next(apiReq);
  }
  return next(req);
};