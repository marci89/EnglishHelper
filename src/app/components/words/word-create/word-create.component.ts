import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { WordService } from '../../../services/word.service';
import { FileUpload, FileUploadErrorEvent, UploadEvent } from 'primeng/fileupload';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-word-create',
  templateUrl: './word-create.component.html',
  styleUrls: ['./word-create.component.css']
})
export class WordCreateComponent implements OnInit {
  createWordForm: FormGroup = new FormGroup({})
  uploadUrl = environment.apiUrl + "word/importWordListFromTextFile";

  //Create a viewChild to get the fileUpload to clear the file if you get an error and you will can open again.
  @ViewChild('fileUpload', { static: false }) fileUpload: FileUpload | undefined;

  constructor(
    private toastr: ToastrService,
    public translate: TranslateService,
    private wordService: WordService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  //Init form
  initForm() {
    this.createWordForm = new FormGroup({
      englishText: new FormControl('', Validators.required),
      hungarianText: new FormControl('', Validators.required),
    });
  }

  //word create
  createWord() {
    this.wordService.create(this.createWordForm.value).subscribe({
      next: _ => {
        this.toastr.success(this.translate.instant('SaveSuccess'))
        this.createWordForm.reset();
      },
      error: error => {
        this.toastr.error(this.translate.instant(error.error))
      }
    })
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

  /// download the word list text file
  exportTextWordList() {
    this.wordService.exportWordListToTextFile().subscribe((fileBlob: Blob) => {
      const blobUrl = window.URL.createObjectURL(fileBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'word-list.txt'; // Specify the file name
      link.click();
    });
  }

  onUploadTextWordList(event: UploadEvent) {
    this.toastr.success(this.translate.instant('EditSuccess'))
  }

  onUploadTextWordListError(event: FileUploadErrorEvent) {
    this.toastr.error(this.translate.instant(event.error?.error))
    //clear the file and you can open again.
    this.fileUpload?.clear();
  }
}

