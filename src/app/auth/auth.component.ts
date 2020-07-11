import { Component, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService, AuthResponseData } from './auth.service';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';


@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})


export class AuthComponent implements OnDestroy {
    isLoginMode = true;
    isLoading = false;
    error:string = null;
    @ViewChild(PlaceholderDirective, { static:false}) alertHost:PlaceholderDirective;

    private closeSub:Subscription;

    constructor(private authService: AuthService,
                private router:Router, 
                private componentFactoryResolver:ComponentFactoryResolver) { }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        if (!form.valid) {
            return;
        }

        const email = form.value.email;
        const password = form.value.password;

        let authObs:Observable<AuthResponseData>

        this.isLoading = true;
        if (this.isLoginMode) {
            authObs = this.authService.login(email, password);
        } else {
            authObs = this.authService.signup(email, password);
        }

        // Clean Code , kita menggunakan subscribe di bawah ini untuk login dan signup
        authObs.subscribe(
            resData => {
                console.log(resData);
                this.isLoading = false;
                this.router.navigate(['/recipes']);
            },
            // Disini kita akan mendapatkan respon dari pipe logic yang telah kita lakukan di auth service (message errornya)
            errorMessage => {
                console.log(errorMessage);
                this.error = errorMessage;
                // Memanggil dynamic component programmaticaly
                // this.showErrorAlert(errorMessage);
                this.isLoading = false;
            }
        );

        form.reset();
    }

    onHandleError() {
        this.error = null;
    }

    ngOnDestroy(){
        if(this.closeSub) {
            this.closeSub.unsubscribe();
        }
    }

    // Membuat dynamic component secara programmaticaly
    // private showErrorAlert(message:string){
    //     const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(
    //         AlertComponent
    //     );

    //     const hostViewContainerRef = this.alertHost.viewContainerRef;
    //     hostViewContainerRef.clear();

    //     const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
    //     componentRef.instance.message = message;
    //     this.closeSub = componentRef.instance.close.subscribe(() => {
    //         this.closeSub.unsubscribe();
    //         hostViewContainerRef.clear();
    //     });
    // }
}