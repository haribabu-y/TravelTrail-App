import { Directive, HostListener } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
    selector:'[stringOnlyDir]'
})
export class StringOnlyDirective {

    constructor(private ngControl: NgControl) {}

    @HostListener("input", ['$event'])
    onInputChange(event: any) {
        const initilValue = event.target.value;
        // console.log(event);
        event.target.value = initilValue.replace(/[^a-zA-Z\s]/g,"");
        // console.log(event.target.value);        

        if(initilValue !== event.target.value) {
            event.stopPropagation();
        }
        this.ngControl.control?.setValue(event.target.value);
    }
}