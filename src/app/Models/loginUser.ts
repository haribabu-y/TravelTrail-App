
export class LoginUser {
    constructor(
        public username: string,
        public id: string,
        public loginTime: number,
        public isAdmin: boolean,
        public country?: Object,
        public tokenId?: string,
        public expiresIn?: Date,
    ){
        
    }
}