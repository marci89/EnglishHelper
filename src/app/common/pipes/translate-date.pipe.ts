import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

//If you use ngx-translate this could be good way to manage date formats different languages
@Pipe({
  name: 'translateDate'
})
export class TranslateDatePipe implements PipeTransform {
  constructor(private translate: TranslateService) { }

  transform(value: string, dateKey: string): string {

    // Default to the input value
    let formattedDate = value;

    // Fetch the translated date format based on the dateKey
    this.translate.get(dateKey).subscribe((dateFormat) => {
      if (dateFormat) {
        const date = new Date(value);
        formattedDate = this.formatDate(date, dateFormat);
      }
    });

    return formattedDate;
  }

  private formatDate(date: Date, format: string): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const hours12 = hours % 12 || 12;
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    format = format.replace('yyyy', year.toString());
    format = format.replace('MM', month.toString().padStart(2, '0'));
    format = format.replace('dd', day.toString().padStart(2, '0'));
    format = format.replace('HH', hours.toString().padStart(2, '0'));
    format = format.replace('hh', hours12.toString().padStart(2, '0'));
    format = format.replace('mm', minutes.toString().padStart(2, '0'));
    format = format.replace('ss', seconds.toString().padStart(2, '0'));

    return format;
  }
}
