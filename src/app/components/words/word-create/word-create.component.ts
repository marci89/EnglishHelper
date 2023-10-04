import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { WordService } from '../../../services/word.service';

@Component({
  selector: 'app-word-create',
  templateUrl: './word-create.component.html',
  styleUrls: ['./word-create.component.css']
})
export class WordCreateComponent implements OnInit {

  //englishTextInput input viewchild
  @ViewChild('englishTextInput') englishTextInput!: ElementRef;

  createWordForm: FormGroup = new FormGroup({})

  constructor(
    private toastr: ToastrService,
    private translate: TranslateService,
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
        //set focus to the first input
        this.englishTextInput.nativeElement.focus();
      },
      error: error => {
        this.toastr.error(this.translate.instant(error.error))
      }
    })
  }
}
