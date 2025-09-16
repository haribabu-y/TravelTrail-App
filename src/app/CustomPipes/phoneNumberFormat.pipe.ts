import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'phoneNumberFormat'
})
export class PhoneNumberFormatPipe implements PipeTransform {
    transform(value: string) {
        // console.log(value);
        value = JSON.stringify(value);
        return JSON.parse(value.slice(0,4) + " " + value.slice(4,7) + " " + value.slice(7));       
    }
}