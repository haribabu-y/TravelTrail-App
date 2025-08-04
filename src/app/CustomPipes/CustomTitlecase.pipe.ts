import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'titlecasepipe'
})
export class CustomTitlecasePipe implements PipeTransform {

    transform(value: string) {
        if(!value) {
            return '';
        }
        let transFormedValue = value.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
        return transFormedValue.join(" ");
    }
}