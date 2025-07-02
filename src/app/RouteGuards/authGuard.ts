import { inject } from "@angular/core";
import { Authservice } from "../Services/auth.service";

export const canActivateRouteGuard = (): boolean => {
    let authService: Authservice = inject(Authservice);
    let isLoggedIn = authService.isloggedIn();
    if(isLoggedIn) {
        return true;
    } else {
        return false
    }
}