import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable()
export class ErrorsInterceptor implements HttpInterceptor {
  constructor(private toastr: ToastrService, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error instanceof HttpErrorResponse) {
          const applicationError = error.headers.get('Application-Error');
          if (applicationError) {
            this.toastr.error(applicationError);
            throw error;
          }
          switch (error.status) {
            case 401:
            case 403:
              localStorage.removeItem('token');
              this.toastr.error('error', 'تسجيل الدخول');
              this.router.navigateByUrl('/auth/login');
              break;
            case 500:
              this.toastr.error('error', 'server error');
              break;
            default:
              this.toastr.error(error.error);
              break;
          }
        }
        throw error;
      })
    );
  }
}
