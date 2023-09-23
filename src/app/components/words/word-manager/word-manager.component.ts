import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { FileUpload, FileUploadErrorEvent, UploadEvent } from 'primeng/fileupload';
import { WordService } from 'src/app/services/word.service';
import { environment } from 'src/environments/environment';
import { ModalService } from '../../../common/services/modal.service';

@Component({
  selector: 'app-word-manager',
  templateUrl: './word-manager.component.html',
  styleUrls: ['./word-manager.component.css']
})
export class WordManagerComponent {
  uploadUrl = environment.apiUrl + "word/importWordListFromTextFile";

  //Create a viewChild to get the fileUpload to clear the file if you get an error and you will can open again.
  @ViewChild('fileUpload', { static: false }) fileUpload: FileUpload | undefined;

  constructor(
    private toastr: ToastrService,
    private translate: TranslateService,
    private wordService: WordService,
    private modalService: ModalService
  ) { }

  // Opening delete many confirmation dialog to handle deleteAllWord action
  openDeleteAllWordConfirmation() {
    this.modalService.openCustomConfirmation(0, this.deleteAllWord.bind(this), 'DeleteConfirmationTitle', 'DeleteManyConfirmationMessage');
  }

  //delete all word
  deleteAllWord() {
    this.wordService.deleteAll().subscribe({
      next: _ => {
        this.toastr.success(this.translate.instant('DeleteSuccess'))
      },
      error: error => {
        this.toastr.error(this.translate.instant(error.error))
      }
    })
  }

  // Opening a custom confirmation dialog to handle resetWordsResults action
  openResetWordsResultsConfirmation() {
    this.modalService.openCustomConfirmation(0, this.resetWordsResults.bind(this), 'ConfirmationTitle', 'ConfirmationMessage');
  }

  //reset Results (good and bad property will be 0)
  resetWordsResults() {
    this.wordService.resetResults().subscribe({
      next: _ => {
        this.toastr.success(this.translate.instant('EditSuccess'))
      },
      error: error => {
        this.toastr.error(this.translate.instant(error.error))
      }
    })
  }

  //download the word list text file
  exportTextWordList() {
    this.wordService.exportWordListToTextFile().subscribe((fileBlob: Blob) => {
      const blobUrl = window.URL.createObjectURL(fileBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'word-list.txt'; // Specify the file name
      link.click();
    });
  }

  //uploader event handler
  onUploadTextWordList(event: UploadEvent) {
    this.toastr.success(this.translate.instant('EditSuccess'))
    this.listWord();
  }

  //uploader event error handler
  onUploadTextWordListError(event: FileUploadErrorEvent) {
    this.toastr.error(this.translate.instant(event.error?.error))
    //clear the file and you can open again.
    this.fileUpload?.clear();
  }

  // list words from server
  listWord() {
    this.wordService.list().subscribe({
      next: _ => { },
      error: error => {
        this.toastr.error(this.translate.instant(error.error))
      }
    })
  }
}


