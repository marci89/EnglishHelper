import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmEventType } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

// Handle different modals
@Injectable({
  providedIn: 'root'
})
export class ModalService {
  public dialogRef: any;

  constructor(
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private translate: TranslateService
  ) { }

  // Opening a modal with any component. Size is in px. Request is the dialog data.
  openDialog(component: any, size: number, request?: any,) {
    const dialogSize = size || 600;

    this.dialogRef = this.dialogService.open(component, {
      width: `${dialogSize}px`,
      baseZIndex: 10000,
      showHeader: false,
      modal: true,
      data: {
        request: request
      }
    });
  }

  // Opening a delete confirmation popoup with any method
  openDeleteConfirmation(
    id: number,
    itemName: string,
    //Handle this any component method to use the appropriate services to delete the item
    deleteMethod: (id: number) => any
  ) {
    this.confirmationService.confirm({
      message: this.translate.instant('DeleteConfirmationMessage') + '<br>' + itemName,
      header: this.translate.instant('DeleteConfirmationTitle'),
      acceptLabel: this.translate.instant('Yes'),
      rejectLabel: this.translate.instant('No'),
      acceptButtonStyleClass: 'confirmation-yes-button',
      rejectButtonStyleClass: 'confirmation-no-button',

      accept: () => {
        deleteMethod(id);
      },
      reject: (type: ConfirmEventType) => {
        switch (type as ConfirmEventType) {
          case ConfirmEventType.REJECT:
            break;
          case ConfirmEventType.CANCEL:
            break;
        }
      }
    });
  }

  // Opening a custom confirmation popoup with any method
  openCustomConfirmation(
    id: number,
    //Handle this any component method to use the appropriate services to do the action
    method: (id: number) => any,
    header: string,
    message: string,
    itemName?: string,
  ) {
    var text = this.translate.instant(message);
    if (itemName) {
      text += '<br>' + itemName
    }

    this.confirmationService.confirm({
      message: text,
      header: this.translate.instant(header),
      acceptLabel: this.translate.instant('Yes'),
      rejectLabel: this.translate.instant('No'),
      acceptButtonStyleClass: 'confirmation-yes-button',
      rejectButtonStyleClass: 'confirmation-no-button',

      accept: () => {
        method(id);
      },
      reject: (type: ConfirmEventType) => {
        switch (type as ConfirmEventType) {
          case ConfirmEventType.REJECT:
            break;
          case ConfirmEventType.CANCEL:
            break;
        }
      }
    });
  }

  // close modal method
  close() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
