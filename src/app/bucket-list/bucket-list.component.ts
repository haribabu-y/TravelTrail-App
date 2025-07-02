import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-bucket-list',
  templateUrl: './bucket-list.component.html',
  styleUrls: ['./bucket-list.component.css']
})
export class BucketListComponent {
  showAddBucketDailog: boolean = false;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // list of bucket list items
  bucketListItems = [
    {
      id: 1,
      image: 'assets/BucketList/Bali.png',
      placeName: 'Bali',
      placeDescription: 'A beautiful island in Indonesia known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs.',
      estimatedDistance: 5000,
      estimatedBudget: 30000
    },
    {
      id: 2,
      image: 'assets/BucketList/Bangkok.png',
      placeName: 'Bangkok',
      placeDescription: 'A beautiful island in Indonesia known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs.',
      estimatedDistance: 5000,
      estimatedBudget: 15000
    },
    {
      id: 3,
      image: 'assets/BucketList/Belgium.png',
      placeName: 'Belgium',
      placeDescription: 'A beautiful island in Indonesia known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs.',
      estimatedDistance: 5000,
      estimatedBudget: 45000
    },
    {
      id: 4,
      image: 'assets/BucketList/Germany.png',
      placeName: 'Germany',
      placeDescription: 'A beautiful island in Indonesia known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs.',
      estimatedDistance: 5000,
      estimatedBudget: 35000
    },
    {
      id: 5,
      image: 'assets/BucketList/Kyoto.png',
      placeName: 'Kyoto',
      placeDescription: 'A beautiful island in Indonesia known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs.',
      estimatedDistance: 5000,
      estimatedBudget: 25000
    }
  ]

  placeImage: string = '';
  placeName: string = '';
  placeDescription: string = '';
  estimatedDistance: number;
  estimatedBudget: number;

  showDailog() {
    this.showAddBucketDailog = true;
  }

  triggerFileinput() {
    this.fileInput.nativeElement.click();  }

  onFilechanges(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if(!file) return;

    const maxInputSize = 2;
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

    if(!allowedTypes.includes(file.type)) {
      alert("Only JPG and PNG formats are allowed.");
      return;
    }

    if(file.size > maxInputSize * 1024 * 1024) {
      alert("File size must be 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.placeImage = reader.result as string;
    }
    reader.readAsDataURL(file);
    
  }

  closeDailog() {
    this.showAddBucketDailog = false;
    console.log(this.placeImage);    
    this.placeImage = '';
    this.placeName = '';
    this.placeDescription = '';
    this.estimatedDistance = 0;
    this.estimatedBudget = 0;
  }

  deleteSelectedPlaceImage() {
    this.placeImage = '';
    this.placeName = '';
    this.placeDescription = '';
    this.estimatedDistance = 0;
    this.estimatedBudget = 0;
  }

  bucketId: number;
  editBucketItem(item) {
    this.showAddBucketDailog = true;
    this.placeImage = item.image;
    this.placeName = item.placeName;
    this.placeDescription = item.placeDescription;
    this.estimatedDistance = item.estimatedDistance;
    this.estimatedBudget = item.estimatedBudget;
    console.log(item.id);
    this.bucketId = item.id;
  }

  deleteBucketItem(item) {
    const index = this.bucketListItems.findIndex(bucketItem => bucketItem.id === item.id);
    if(index !== -1) {
      this.bucketListItems.splice(index, 1);      
    }
    this.closeDailog();    
  }

  addRecord(id?: number) {
    if(id) {
      const index = this.bucketListItems.findIndex(item => item.id === id);
      if(index !== -1) {
        this.bucketListItems[index] = {
          id: id,
          image: this.placeImage,
          placeName: this.placeName,
          placeDescription: this.placeDescription,
          estimatedDistance: this.estimatedDistance,
          estimatedBudget: this.estimatedBudget
        };
      }
      this.closeDailog();

      return;
    }
    if(!this.placeImage || !this.placeName || !this.placeDescription || !this.estimatedDistance || !this.estimatedBudget) {
      alert("Please fill all the fields.");
      return;
    }

    let newBucketItem = {
      id: this.bucketListItems.length + 1,
      image: this.placeImage,
      placeName: this.placeName,
      placeDescription: this.placeDescription,
      estimatedDistance: this.estimatedDistance,
      estimatedBudget: this.estimatedBudget
    }

    this.bucketListItems.push(newBucketItem);
    this.closeDailog();
  }
}
