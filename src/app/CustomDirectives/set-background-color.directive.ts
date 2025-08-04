import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appSetBackgroundColor]'
})
export class SetBackgroundColorDirective {

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

}
