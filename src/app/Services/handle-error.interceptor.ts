import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable()
export class HandleErrorInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler) {
    return next.handle(request)
                .pipe(catchError((error: HttpErrorResponse) => {
                  console.log(error);
                  return throwError(error.error);
                }));
  }
}
