import { inject } from '@angular/core/primitives/di';
import { AccountService } from './../services/account-service';
import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);
  const user = accountService.currentUser();

  if(user){
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${user.token}`
      }
    })
  }

  return next(req);
};
