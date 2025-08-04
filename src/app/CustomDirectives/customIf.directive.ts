import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";

@Directive({
    selector:'[appIf]'
})
export class CustomIfDirective {
    constructor(private template: TemplateRef<any>, private view: ViewContainerRef) {}

    @Input() set appIf(condition: boolean) {
        if(condition) {
            this.view.createEmbeddedView(this.template);
        } else {
            this.view.clear();
        }
    }

}