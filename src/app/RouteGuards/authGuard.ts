import { inject } from "@angular/core";
import { Authservice } from "../Services/auth.service";
import { Router } from "@angular/router";

export const canActivateRouteGuard = () => {
    let authService: Authservice = inject(Authservice);
    let isLoggedIn = authService.isloggedIn();
    // if(isLoggedIn) {
    //     return true;
    // } else {
    //     return false;
    // }
    let router: Router = inject(Router);

    let localUser = JSON.parse(localStorage.getItem("user"));
    if(localUser) {
        return true;
    } else {
        router.navigate(['/login']);
        return false;
    }

}