import { Directive, HostListener } from "@angular/core";

@Directive({
    selector: '[digitsOnlyDir]'
})
export class DigitsOnlyDirective {
    @HostListener('input', ['$event'])
    onInputChange(event: any) {
        const initilValue = event.target.value;
        event.target.value = initilValue.replace(/[^0-9]/g, '');

        if(initilValue !== event.target.value) {
            event.stopPropagation();
        }
    }
}