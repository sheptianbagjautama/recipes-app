import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
              private router:Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    return this.authService.user.pipe(
      /**
       * take(1) -> memastikan mengambil value data user terbaru/latest dan kemudian
       * akan melakukan unsubsribe
       */
      take(1),
      map((user) => {
        // console.group('Ini adalah dari file auth guards')
        // console.log(user);
        // console.log(!user);
        // console.log(!!user);
        // console.groupEnd();
        const isAuth = user ? true : false;
        if (isAuth) {
            return true;
        }
        // Menggunakan URLTree Fitur baru
        return this.router.createUrlTree(['/auth']);
      }),
    //   Cara Lama
    //   tap(isAuth => {
    //       if (!isAuth) {
    //           this.router.navigate(['/auth']);
    //       }
    //   })
    );
  }
}
