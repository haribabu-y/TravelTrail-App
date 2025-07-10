// export class LoginUser {
//     constructor(
//         public email: string,
//         public id: string,
//         private _token: string,
//         private _expiresIn: Date
//     ){
        
//     }
//     get token(){
//         if(!this._expiresIn || this._expiresIn < new Date()){
//             return null;
//         }
//         return this._token;
//     }
// }

// export class LoginUser {
//     constructor(
//         public email: string,
//         public id: string,
//         public _expiresIn: Date
//     ){
        
//     }
// }

export class LoginUser {
    constructor(
        public username: string,
        public id: string,
        public loginTime: number,
        public isAdmin: boolean
    ){
        
    }
}