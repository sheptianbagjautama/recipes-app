import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

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

    constructor(private http: HttpClient) { }

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
        .pipe(catchError(this.handleError));
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
        .pipe(catchError(this.handleError));
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