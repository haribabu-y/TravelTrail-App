export class BucketList {
    constructor(
        public placeImage: string,
        public placeName: string,
        public placeDescription: string,
        public estimatedDistance: number,
        public estimatedBudget: number,
        public id?: string
    ) {
        
    }
}