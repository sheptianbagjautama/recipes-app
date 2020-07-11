import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private authService:AuthService) {}

    intercept(req:HttpRequest<any>, next:HttpHandler) {
         /**
         * take(1) --> mengambil data terakhir user
         * exhaustMap --> fungsinya untuk menunggu observable pertama yaitu this.authService.user. setelah 
         * observable pertama tersebut selesai, akan lanjut ke observable kedua
         */
        return this.authService.user.pipe(
            take(1), 
            /**
             * Observable pertama akan mendapatkan data user dari behaviour object, 
             * disini kita parse lagi untuk di gunakan di observable kedua yaitu HTTP Request
             */
            exhaustMap(user => {
                // Jika token null
                if(!user) {
                    return next.handle(req);
                }

                // Jika token tidak null
                // Menambahkan token ke seluruh Http Request yang ada 
                const modifiedReq = req.clone({
                    params:new HttpParams().set('auth', user.token)
                });
                return next.handle(modifiedReq);
            })
        );
    }
}