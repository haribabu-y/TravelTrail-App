import { Directive, DoCheck, ElementRef, Input, OnChanges, Renderer2 } from "@angular/core";

@Directive({
    selector: '[appClass]'
})
export class CustomClassDirective implements DoCheck {

    constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

    @Input('appClass') toggleClass!: {className: string, condition: boolean};

    ngDoCheck(): void {
        if(this.toggleClass.condition) {
            this.renderer.addClass(this.elementRef.nativeElement, this.toggleClass.className);
        } else {
            this.renderer.removeClass(this.elementRef.nativeElement, this.toggleClass.className);
        }
    }
}