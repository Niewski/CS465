import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Provider } from '@angular/core';
import { Observable } from 'rxjs';
import { Authentication } from '../services/authentication';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: Authentication) {}

  intercept(request: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    var isAuthAPI: boolean;
    if(request.url.includes('login') || request.url.includes('register')) {
      isAuthAPI = true;
    } else {
      isAuthAPI = false;
    }
    if(!isAuthAPI && this.authenticationService.isLoggedIn()) {
      let token = this.authenticationService.getToken();
      const authReq = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      return next.handle(authReq);
    }
    return next.handle(request.clone({ withCredentials: true }));
  }
}

export const authInterceptProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: JwtInterceptor,
  multi: true
};