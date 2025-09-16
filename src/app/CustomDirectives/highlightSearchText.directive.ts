import { Directive, DoCheck, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from "@angular/core";

@Directive({
    selector:'[highlightSearchText2]'
})
export class HighlightSearchTextDirective implements OnInit, OnChanges, DoCheck {

    constructor(private elementRef: ElementRef,private renderer: Renderer2) {}

    @Input('highlightSearchText2') searchText: string = '';

    ngOnChanges(changes: SimpleChanges): void {
        // this.applyHighlight(this.searchText);
        // console.log(this.elementRef.nativeElement.innerHTML);
    }

    ngOnInit(): void {
        // console.log(this.elementRef.nativeElement);
        
    }

    ngDoCheck(): void {
        this.applyHighlight(this.searchText);
    }

    applyHighlight(text: string) {
        const originalText = this.elementRef.nativeElement.textContent;
        // console.log(originalText);        
        // if(text === '') {
        //     // this.elementRef.nativeElement.innerHTML = originalText;
        //     return;
        // }

        if(!originalText) {
            return;
        }

        // if (text) {
        //     let text2 = new RegExp(text, 'gi')
        //     console.log(text2);            
        //     let matchedTextIndex = originalText.search(text2);
        //     console.log(matchedTextIndex);
        //     let matchedText: string;
        //     if(matchedTextIndex !== -1) {
        //         // console.log(originalText);                
        //         matchedText = originalText.slice(matchedTextIndex, matchedTextIndex+text.length)
        //         console.log(matchedText);
        //     } 
        //     else {
        //         matchedText = text
        //         console.log(matchedText);                
        //     }
        //     // let matchedText = originalText.slice(matchedTextIndex, text.length)
        //     // console.log(matchedText);
                        
        //     const highlighted = originalText
        //      .split(text2)
        //      .join(`<span style="color: coral;">${matchedText}</span>`);
        //     this.elementRef.nativeElement.innerHTML = highlighted;
        // } else {
        //     this.elementRef.nativeElement.innerHTML = originalText;
        // }
        // let regex = new RegExp(text, 'gi')
        // let highlightedText = originalText.replace(regex, `<span style="color: coral;">$1</span>`) 
        // this.elementRef.nativeElement.innerHTML = highlightedText;

        const regex = new RegExp(`(${text})`, 'gi');
        // console.log(regex);        
        const highlighted = originalText.replace(regex, `<span style="color: coral;">$1</span>`);
        // console.log(highlighted);
        this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', highlighted);
    }
    
}