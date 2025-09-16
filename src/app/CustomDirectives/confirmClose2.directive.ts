import { Directive, ElementRef, HostListener, Input, Renderer2 } from "@angular/core";

@Directive({
    selector: '[confirmClose2]'
})
export class ConfirmClose2Directive {
    constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

    isValueChanged: boolean = false;
    initialValue: any;

    @Input('confirmClose2') fieldValue: any;

    ngOnInit(): void {
        // console.log(this.fieldValue);    
        this.initialValue = this.fieldValue; 
    }

    @HostListener('input', ['$event'])
    onInput(event: any) {
        // console.log(event);
        // console.log(this.fieldValue);
        // console.log(event.target.value);                        
        if(this.initialValue !== event.target.value) {
            // console.log("Value changed");            
            this.isValueChanged = true;
        } else {
            this.isValueChanged = false;
        }
        // console.log(this.isValueChanged);  
    }

    getIfvaluechangedOrNot() {
        // console.log("Returning value : " + this.isValueChanged);
        return this.isValueChanged;
    }

    changeToDefault() {
        this.isValueChanged = false;
    }
}