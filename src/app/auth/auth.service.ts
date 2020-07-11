import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { User } from './user.model';

// https://firebase.google.com/docs/reference/rest/auth#section-create-email-password

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    // ? adalah opsional, kosong pun tidak apa apa
    registered?:boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    user = new BehaviorSubject<User>(null);
    tokenExpirationTimer:any;
    constructor(private http: HttpClient,
                private router:Router) { }

    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDo84D8Ys84OIf3AJb7QKK0L0cjRYKepZc',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        )
        // Logic untuk configurasi/handle berbagai macam error dari Firebase
        .pipe(
            catchError(this.handleError), 
            tap(resData => {
                this.handleAuthentication(
                    resData.email,
                    resData.localId,
                    resData.idToken,
                    +resData.expiresIn
                );
            })
        );
    }

    login(email:string, password:string){
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDo84D8Ys84OIf3AJb7QKK0L0cjRYKepZc',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        )
        // Logic untuk configurasi/handle berbagai macam error dari Firebase
        .pipe(
            catchError(this.handleError),
            tap(resData => {
                this.handleAuthentication(
                    resData.email,
                    resData.localId,
                    resData.idToken,
                    +resData.expiresIn
                );
            })
        );
    }

    // Set Local Storage ketika user login
    autoLogin(){
        const userData:{
            email:string,
            id:string,
            _token:string;
            _tokenExpirationDate:string;
        } = JSON.parse(localStorage.getItem('userData'));

        if(!userData) {
            return;
        }

        const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
        );

        // Jika getter token dari model User true atau lebih tepatnya token masih belum kadaluarsa maka kita emitt data dari storage
        // agar dapat digunakan oleh component lain
        if(loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration = 
            new Date(userData._tokenExpirationDate).getTime() -
            new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }
    
    logout(){
        // set data user menjadi null
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
    }

    autoLogout(expirationDuration:number){
        console.log(expirationDuration);
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    private handleAuthentication(email:string, userId:string, token:string, expiresIn:number) {
        // Generate expirationDate
        const expirationDate = new Date(
            new Date().getTime() + +expiresIn * 1000
        );
        const user = new User(email,userId,token,expirationDate);
        this.user.next(user);
        // Auto logout jika expireres melebih tanggal dan jam current
        // Dikalikan 1000 untuk konversi dari seconds ke miliseconds
        this.autoLogout(expiresIn * 1000);
        // Convert JSON to String/Text
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorRes:HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
                if (!errorRes.error || !errorRes.error.error) {
                    // Melempar error ketika fungsi ini di subscribe
                    return throwError(errorMessage);
                }

                switch(errorRes.error.error.message) {
                    // Jika message dari Firebase nya adalah :
                    case 'EMAIL_EXISTS':
                        errorMessage = 'This email exists already';
                        break;
                    case 'EMAIL_NOT_FOUND':
                        errorMessage = 'This email does not exist.';
                        break;
                    case 'INVALID_PASSWORD':
                        errorMessage = 'This password is not correct.';
                        break;
                }
                // Melempar error ketika fungsi ini di subscribe
                return throwError(errorMessage);
    }
}