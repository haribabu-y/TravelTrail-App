import { Directive, HostListener } from "@angular/core";

@Directive({
    selector:'[stringOnlyDir]'
})
export class StringOnlyDirective {
    @HostListener("input", ['$event'])
    onInputChange(event: any) {
        const initilValue = event.target.value;
        // console.log(event);
        event.target.value = initilValue.replace(/[^a-zA-Z\s]/g,"");
        // console.log(event.target.value);        

        if(initilValue !== event.target.value) {
            event.stopPropagation();
        }
    }
}