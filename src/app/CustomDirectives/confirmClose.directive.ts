import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from "@angular/core";
import { SharedService } from "../Services/shared.service";

@Directive({
    selector: '[confirmClose]'
})
export class ConfirmCloseDialogDirective implements OnInit {

    constructor(private elementRef: ElementRef, private renderer: Renderer2, private sharedService: SharedService) {          
    }

    initialValue: string = '';
    isValueChanged: boolean = false;

    @Input('confirmClose') fieldValue: string = ''

    ngOnInit(): void {
        this.initialValue = this.fieldValue;
    }

    @HostListener('input', ['$event'])
    onInput(event: any) {
        if(this.initialValue !== event.target.value) {
            this.isValueChanged = true;
            this.sharedService.emitInputValueChaangedEvent(this.isValueChanged);
        } else {
            this.isValueChanged = false;
            this.sharedService.emitInputValueChaangedEvent(this.isValueChanged);
        }
    }
}