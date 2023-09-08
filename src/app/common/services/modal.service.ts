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
  private dialogRef: any;

  constructor(
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private translate: TranslateService
  ) { }

  // Opening a modal with any component
  openDialog(component: any, size?: number) {
    const dialogSize = size || 50;

    this.dialogRef = this.dialogService.open(component, {
      width: `${dialogSize}%`,
      baseZIndex: 10000,
      showHeader: false,
      modal: true
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
      icon: 'pi pi-trash',
      acceptLabel: this.translate.instant('Yes'),
      rejectLabel: this.translate.instant('No'),
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

  // close modal method
  close() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
