import { BucketList } from "./bucketList";

export class UserTrips {
    constructor(
        public username: string,
        public totalDistance: number,
        public gender: string,
        public age: number,
        public totalExpense: number,
        public id?: string,
    ){}
}