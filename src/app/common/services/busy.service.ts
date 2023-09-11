import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

//Busy service for loader functionality. This will help for it.
@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyRequestCount = 0;

  constructor(private spinnerService: NgxSpinnerService) { }

  busy() {
    this.busyRequestCount++;
    this.spinnerService.show(undefined, {
      type: 'ball-spin-fade-rotating',
      bdColor: 'rgba(255,255,255,0)',
      color: '#FFFFFF'
    })
  }

  idle() {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.spinnerService.hide();
    }
  }
}
