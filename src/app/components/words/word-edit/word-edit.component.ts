import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from 'src/app/common/services/modal.service';
import { WordService } from '../../../services/word.service';
import { UpdateWordRequest, Word } from 'src/app/interfaces/word.interface';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';



@Component({
  selector: 'app-word-edit',
  templateUrl: './word-edit.component.html',
  styleUrls: ['./word-edit.component.css']
})
export class WordEditComponent implements OnInit {
  editWordForm: FormGroup = new FormGroup({})
  word: Word = {} as Word;
  updateWordRequest: UpdateWordRequest = {} as UpdateWordRequest;
  serverError: string = "";

  constructor(
    private toastr: ToastrService,
    private translate: TranslateService,
    private modalService: ModalService,
    private wordService: WordService,
    private config: DynamicDialogConfig

  ) { }

  ngOnInit(): void {
    this.initForm();
    this.readWord();
  }

  //Get dialog data (id)
  getIdFromDialog(){
    return this.config?.data?.request
  }

  // Init form
  initForm() {
    this.editWordForm = new FormGroup({
      englishText: new FormControl('', Validators.required),
      hungarianText: new FormControl('', Validators.required),
      correctCount: new FormControl(0, Validators.required),
      incorrectCount: new FormControl(0, Validators.required),
    });
  }

   //Add values for editWordForm
   addValuesToForm() {
    this.editWordForm.patchValue(this.word)
  }

   // Read word by id
   readWord() {
    const id = this.getIdFromDialog();
    this.wordService.readById(id).subscribe({
      next: word => {
        this.word = word;
        this.addValuesToForm();
      },
      error: error => {
        this.toastr.error(this.translate.instant(error.error))
      }
    });
  }

  //Word edit
  editWord() {
    this.updateWordRequest = this.editWordForm.value;
    this.updateWordRequest.id = this.getIdFromDialog();

    this.wordService.update(this.updateWordRequest).subscribe({
      next: _ => {
        this.toastr.success(this.translate.instant('EditSuccess'))
        this.modalService.close();
      },
      error: error => {
        this.serverError = error.error;
      }
    })
  }

  // close teh dialog modal
  cancel() {
    this.modalService.close();
  }
}
