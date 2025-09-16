import { Directive, DoCheck, ElementRef, Input, OnInit, Renderer2 } from "@angular/core";

@Directive({
    selector: '[highlightSearchText]'
})
export class HighlightSearchedTextDirective implements OnInit, DoCheck {

    constructor(private elementRef: ElementRef, private renderer: Renderer2) {  } 
    
    @Input('highlightSearchText') value: string = ''; 

    ngDoCheck(): void {
        let allFields = document.querySelectorAll('.tableField');
        // console.log(allFields);        
        allFields.forEach((field) => {
            // console.log(field.getAttribute('highlightSearchText'));            
            if(field.getAttribute('highlightSearchText')) {
                this.value = field.getAttribute('highlightSearchText');
                // let fieldText =  field.innerHTML.replace(/\W/g, '')
                // if(fieldText.toLowerCase().includes(this.value) && this.value !== '') {
                //     // (field as HTMLElement).style.backgroundColor = 'lightblue'
                //     this.renderer.addClass(field, 'highlightField');
                // }
                if(this.value !== '') {
                    // (field as HTMLElement).style.backgroundColor = 'lightblue'
                    this.renderer.addClass(field, 'highlightField');
                }
            }  else {
                this.renderer.removeClass(field, 'highlightField');
            }
        })
    }
    
    ngOnInit(): void {
        // console.log(this.value); 
        
        // let tableBodyDom = document.querySelector('.p-datatable-tbody')
        // console.log(tableBodyDom);
        // let allFields = tableBodyDom.querySelectorAll('.tableField');
        // console.log(allFields);        
        // this.renderer.addClass(this.elementRef.nativeElement, 'highlightField');
        // console.log(allFields[1].innerHTML);    
        // console.log(event);    
        // let searchText = '20';
        // console.log(searchText);  
        // allFields.forEach((field) => {
        // let fieldText =  field.innerHTML.replace(/\W/g, '')
        // let attrValue = field.getAttribute('highlightSearchText');
        // console.log(attrValue);
        // console.log(field.innerHTML.includes(searchText));      
        // if(fieldText.toLowerCase().includes(this.value) && this.value !== '') {
            // (field as HTMLElement).style.backgroundColor = 'lightblue'
            // field.setAttribute('highlightSearchText', '');
            // this.renderer.addClass(field, 'highlightField');
        // }
        // })
    }
}