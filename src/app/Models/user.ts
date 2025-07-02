export class User {
    constructor(
        public profileImage: string,
        public username: string,
        public id: string,
        public firstName: string,
        public gender: string,
        public dob: Date,
        public email: string,
        public phone: string,
        public address: string,
        public country: string,
        public state: string,
        public zipCode: string,
        public timeZone: string,
        public locale: string,
        public isAdmin: boolean,
        public password: string,
        public confirmPassword: string,
        public lastName?: string,
    ) {}
}