import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from "@angular/core";
import { ConfirmCloseService } from "../Services/confirm-close.service";

@Directive({
    selector: '[confirmClose3]'
})
export class ConfirmClose3Directive  implements OnInit{
    @Input('confirmClose3') fieldValue: string = '';
    
     private inputId = crypto.randomUUID();

     constructor(private elementRef: ElementRef, private renderer: Renderer2, private confirmCloseService: ConfirmCloseService) {}

     ngOnInit(): void {
        this.confirmCloseService.registerInput(this.inputId, this.fieldValue);
    }

    @HostListener('input', ['$event'])
    onInput(event: any) {
        console.log(event);        
        const currentValue = event.target.value;
        this.confirmCloseService.updateInput(this.inputId, currentValue);
    }
}