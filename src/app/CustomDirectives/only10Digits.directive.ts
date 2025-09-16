import { Directive, HostListener } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
    selector: '[only10DigitsDir]'
})
export class Only10DigitsDirective {
    constructor(private ngControl: NgControl) {}

    @HostListener('input', ['$event'])
    onInput(event: any) {
        let inputValue = event.target.value;

        inputValue = inputValue.replace(/\D/g, '');

        // if(inputValue.length > 10) {
        //     event.stopPropagation();
        // }

        if(inputValue.length > 10) {
            inputValue = inputValue.substring(0,10);
        }

        this.ngControl.control?.setValue(inputValue);
    }
}