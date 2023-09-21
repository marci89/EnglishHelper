import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ModalService } from 'src/app/common/services/modal.service';
import { Word } from 'src/app/interfaces/word.interface';
import { WordService } from 'src/app/services/word.service';
import { WordEditComponent } from '../word-edit/word-edit.component';

@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.component.html',
  styleUrls: ['./word-list.component.css']
})
export class WordListComponent implements OnInit, OnDestroy {
  words: Word[] = [];
  wordListSubscription$: Subscription | undefined;

  constructor(
    private wordService: WordService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private modalService: ModalService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    //subscribe word list to update the table from different components
    this.wordListSubscription$ = this.wordService.wordList$.subscribe({
      next: words => {
        this.words = words ?? [];
      }
    });

    this.listWord();
  }

  // list words from server
  listWord() {
    this.wordService.list().subscribe({
      next: _ => {},
      error: error => {
        this.toastr.error(this.translate.instant(error.error))
      }
    })
  }

  //Word Edit popup
  openEditWordDialog(id: number) {
    this.modalService.openDialog(WordEditComponent, 600, id);
  }

  // Opening delete confirmation dialog to handle delete action
  openDeleteConfirmation(id: number, username: string) {
    this.modalService.openDeleteConfirmation(id, username, this.deleteWord.bind(this));
  }

  // deleting word by id
  public deleteWord(id: number) {
    this.wordService.delete(id).subscribe({
      next: _ => {
        this.toastr.success(this.translate.instant('DeleteSuccess'))
      },
      error: error => {
        this.toastr.error(this.translate.instant(error.error))
      }
    })
  }

  ngOnDestroy() {
    if (this.wordListSubscription$) {
      this.wordListSubscription$.unsubscribe();
    }
  }
}
