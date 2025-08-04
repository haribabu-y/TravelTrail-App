import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlightRow]'
})
export class HighlightRowDirective {

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

    @HostListener("mouseenter")
    onMouseEnter() {
        this.renderer.addClass(this.elementRef.nativeElement, 'highlightrow');
    }

    @HostListener('mousemove')
    onMouseMove() {
      this.renderer.addClass(this.elementRef.nativeElement, 'highlightrow');
    }

    @HostListener("mouseout")
    onMouseOut() {
        this.renderer.removeClass(this.elementRef.nativeElement, 'highlightrow');
    }

}
