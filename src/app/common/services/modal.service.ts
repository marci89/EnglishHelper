import { Injectable} from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private dialogRef: any;

  constructor(private dialogService: DialogService) {}

  openDialog(component: any, size?: number) {
    const dialogSize = size ?? 50;

    this.dialogRef = this.dialogService.open(component, {
      width: `${dialogSize}%`,
      baseZIndex: 10000,
      showHeader: false,
      modal: true
    });
  }

  close() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
