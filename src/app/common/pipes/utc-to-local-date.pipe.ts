import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'utcToLocalDate'
})
export class UtcToLocalDatePipe implements PipeTransform {
  transform(utcDate: string, format: string = 'yyyy.MM.dd hh:mm'): string {
    if (utcDate === null || utcDate === undefined) {
      return utcDate;
    }

    const utcDateTime = new Date(utcDate);

 // Get the local time zone offset and convert it to milliseconds
 const timeZoneOffsetMs = new Date().getTimezoneOffset() * 60000;

 // Convert the UTC date to the local date and time
 const localDateTime = new Date(utcDateTime.getTime() - timeZoneOffsetMs);


    // Format the local date and time as desired
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,

    };

      const formattedDateTime = format
      .replace('yyyy', localDateTime.getFullYear().toString())
      .replace('MM', (localDateTime.getMonth() + 1).toString().padStart(2, '0'))
      .replace('dd', localDateTime.getDate().toString().padStart(2, '0'))
      .replace('hh', localDateTime.getHours().toString().padStart(2, '0'))
      .replace('mm', localDateTime.getMinutes().toString().padStart(2, '0'))
      .replace('ss', localDateTime.getSeconds().toString().padStart(2, '0'))
      .replace('a', localDateTime.getHours() < 12 ? 'AM' : 'PM');

    return formattedDateTime;
  }
}
