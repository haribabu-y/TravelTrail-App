import { HttpHandler, HttpHeaders, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";

export class authInterceptorSevice implements HttpInterceptor {
    
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        console.log(req.url);        
        let user = JSON.parse(localStorage.getItem('user'));
        if(req.url === 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA0CxBGkhNtT1q48ZjBhu4aFn1FsQgYoxs') {
            // console.log("url is 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA0CxBGkhNtT1q48ZjBhu4aFn1FsQgYoxs'");            
            return next.handle(req);
        }
        if(req.url === 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA0CxBGkhNtT1q48ZjBhu4aFn1FsQgYoxs') {
            return next.handle(req);
        }
        if(req.url === 'https://identitytoolkit.googleapis.com/v1/accounts:delete?key=AIzaSyA0CxBGkhNtT1q48ZjBhu4aFn1FsQgYoxs') {
            return next.handle(req);
        }
        if(!user) {
            return next.handle(req);
        } else {
            let modifiedUrl = req.clone({
            params: new HttpParams().set("auth", user.tokenId),
            headers: new HttpHeaders().set("data", 'Modified URL')
            })
            return next.handle(modifiedUrl);
        }
        
    }
}