import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BucketList } from '../Models/bucketList';
import { BucketListService } from '../Services/bucketList.service';
import { MessageService } from 'primeng/api';
import { SharedService } from '../Services/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bucket-list',
  templateUrl: './bucket-list.component.html',
  styleUrls: ['./bucket-list.component.css']
})
export class BucketListComponent implements OnInit, OnDestroy {
  showAddBucketDailog: boolean = false;
  isLoading: boolean = false;
  isAdmin: boolean = false;
  isDarkMode: boolean = false;
  currencyCode: string = '';

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  userBucketLists: BucketList[];
  bucketListService: BucketListService = inject(BucketListService);
  sharedService: SharedService = inject(SharedService);
  messageService: MessageService = inject(MessageService);
  darkThemeSubscription: Subscription;

  ngOnInit(): void {
    this.darkThemeSubscription = this.sharedService.isDarkMode.subscribe((res) => this.isDarkMode = res)
    localStorage.getItem('theme') === 'dark' ? this.isDarkMode = true : this.isDarkMode = false;
    this.getbucketlists();
    this.currencyCode = JSON.parse(localStorage.getItem('user')).country.currencyCode;
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
  placeImageErrormsg: string;

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
      this.placeImageErrormsg = "Only JPG and PNG formats are allowed.";
      this.isPIV = true;
      // alert("Only JPG and PNG formats are allowed.");
      // this.messageService.add({severity:'warn', summary: 'Warn', detail:'Only JPG and PNG formats are allowed.'})
      return;
    } else {
      this.isPIV = false
    }

    if(file.size > maxInputSize * 1024 * 1024) {
      this.placeImageErrormsg = "File size must be 2MB.";
      this.isPIV = true;
      // alert("File size must be 2MB.");
      return;
    } else {
      this.isPIV = false;
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

    this.isPIV = false;
    this.isPNV = false;
    this.isPDV = false;
    this.isEDV = false;
    this.isEBV = false;
  }

  deleteSelectedPlaceImage() {
    this.placeImage = '';
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

  validatePlaceName() {
    const pattern = /^[a-zA-Z\s]*$/;
    this.isPNV = !pattern.test(this.placeName || '');
  }
  validatePlaceDescription() {
    const pattern = /^[a-zA-Z\s]*$/;
    this.isPDV = !pattern.test(this.placeDescription || '');
  }
  validateED() {
    if(this.estimatedDistance === 0 || this.estimatedDistance === null) {      
      this.isEDV = true;
    } else{
      this.isEDV = false;
    }
  }
  validateEB() {
    if(this.estimatedBudget === 0 || this.estimatedBudget === null) {
      this.isEBV = true;
    } else {
      this.isEBV = false;
    }
  }

  isPIV: boolean = false;
  isPNV: boolean = false;
  isPDV: boolean = false;
  isEDV: boolean = false;
  isEBV: boolean = false;

  addRecord(id?: string) {
    console.log(typeof this.estimatedDistance);    
    if(this.placeImage === '') {
      this.placeImageErrormsg = "Place Image is required!."
      this.isPIV = true;
      // return;
    } else {
      this.isPIV = false;
    }
    if(this.placeName === '') {
      this.isPNV = true;
      // return;
    } else {
      this.isPNV = false;
    }
    if(this.placeDescription === '') {
      this.isPDV = true;
      // return;
    } else {
      this.isPDV = false;
    }
    if(this.estimatedDistance === 0 || this.estimatedDistance === undefined || this.estimatedDistance === null) {
      this.isEDV = true;
      // return;
    } else {
      this.isEDV = false;
    }
    if(this.estimatedBudget === 0 || this.estimatedBudget === undefined || this.estimatedBudget === null) {
      this.isEBV = true;
      // return;
    } else {
      this.isEBV = false;
    }    
    if(this.placeImage === '' || this.placeName === '' || this.placeDescription === '' || (this.estimatedDistance === 0 || this.estimatedDistance === undefined || this.estimatedDistance === null) || (this.estimatedBudget === 0 || this.estimatedBudget === undefined || this.estimatedBudget === null)) {
      // this.messageService.add({severity:'error', summary:'Error', detail:'Please fill all the fields'});
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

  ngOnDestroy(): void {
    if(this.darkThemeSubscription) {
      this.darkThemeSubscription.unsubscribe();
    }
  }
}
