export class Trip {
    constructor(
        public startLocation: string,
        public destination: string,
        public totalDistance: number,
        public totalExpense: number,
        public totalMembers: number,
        public id?: string,
    ) {
        
    }
}