import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { BucketList } from '../Models/bucketList';
import { BucketListService } from '../Services/bucketList.service';
import { MessageService } from 'primeng/api';
import { SharedService } from '../Services/shared.service';

@Component({
  selector: 'app-bucket-list',
  templateUrl: './bucket-list.component.html',
  styleUrls: ['./bucket-list.component.css']
})
export class BucketListComponent implements OnInit{
  showAddBucketDailog: boolean = false;
  isLoading: boolean = false;
  isAdmin: boolean = false;
  isDarkMode: boolean = false;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  userBucketLists: BucketList[];
  //Getting the instance of the bucketList service
  bucketListService: BucketListService = inject(BucketListService);
  sharedService: SharedService = inject(SharedService);
  messageService: MessageService = inject(MessageService);

  ngOnInit(): void {
    this.sharedService.isDarkMode.subscribe((res) => this.isDarkMode = res)
    localStorage.getItem('theme') === 'dark' ? this.isDarkMode = true : this.isDarkMode = false;
    this.getbucketlists();
  }

  getbucketlists() {
    this.isLoading = true;
    this.bucketListService.getAllBucketLists().subscribe((bucketLists: BucketList[]) => {
      this.userBucketLists = bucketLists;
      this.isLoading = false;
    })
  }

  placeImage: string = '';
  placeName: string = '';
  placeDescription: string = '';
  estimatedDistance: number;
  estimatedBudget: number;

  showDailog() {
    this.showAddBucketDailog = true;
  }

  triggerFileinput() {
    this.fileInput.nativeElement.click();  
  }

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
      console.log(reader.result as string);      
    }
    reader.readAsDataURL(file);
    
  }

  closeDailog() {
    this.showAddBucketDailog = false;
    this.bucketId = ''
    // console.log(this.placeImage);    
    this.placeImage = '';
    this.placeName = '';
    this.placeDescription = '';
    this.estimatedDistance = null;
    this.estimatedBudget = null;
  }

  deleteSelectedPlaceImage() {
    this.placeImage = '';
    // this.placeName = '';
    // this.placeDescription = '';
    // this.estimatedDistance = 0;
    // this.estimatedBudget = 0;
  }

  bucketId: string;
  editBucketItem(item: BucketList) {
    this.showAddBucketDailog = true;
    this.placeImage = item.placeImage;    
    this.placeName = item.placeName;
    this.placeDescription = item.placeDescription;
    this.estimatedDistance = item.estimatedDistance;
    this.estimatedBudget = item.estimatedBudget;
    console.log(item.id);
    this.bucketId = item.id;
  }

  deleteBucketItem(item: BucketList) {
    let itemId = item.id;
    this.bucketListService.deleteUserbucketItem(itemId).subscribe((res) => {
      this.getbucketlists();
    });
    this.closeDailog();
  }

  addRecord(id?: string) {
    if(this.placeImage === '' || this.placeName === '' || this.placeDescription === '' || this.estimatedDistance === 0 || this.estimatedBudget === 0) {
      this.messageService.add({severity:'error', summary:'Error', detail:'Please fill all the fields'});
      return;
    }
    let newBucketItem = {
      placeImage: this.placeImage,
      placeName: this.placeName,
      placeDescription: this.placeDescription,
      estimatedDistance: this.estimatedDistance,
      estimatedBudget: this.estimatedBudget
    }
    if(id) {
      this.bucketListService.updateUserBucketItem(id,newBucketItem).subscribe((res) => {
        this.getbucketlists();
        this.bucketId = '';
        this.messageService.add({severity:'success', summary:'Success', detail:'BucketList Successfully Updated!.'})
      });
      this.closeDailog();
      return;
    }


    console.log(newBucketItem);    
    this.bucketListService.addNewBucketListitem(newBucketItem).subscribe((res) => {
      this.getbucketlists();
      this.messageService.add({severity:'success', summary:'Success', detail:'BucketList Successfully Added!.'})
    });
    this.closeDailog();
  }
}
