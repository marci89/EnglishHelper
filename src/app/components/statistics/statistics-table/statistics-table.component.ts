import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from 'src/app/common/services/modal.service';
import { LearnStatistics } from 'src/app/interfaces/learn-statistics.interface';
import { LearnModeType } from 'src/app/interfaces/learn.interface';
import { LearnStatisticsService } from 'src/app/services/learn-statistics.service';

@Component({
  selector: 'app-statistics-table',
  templateUrl: './statistics-table.component.html',
  styleUrls: ['./statistics-table.component.css']
})
export class StatisticsTableComponent implements OnInit {
  statistics: LearnStatistics[] = [];

  // Custom filter options for the learnMode column
  customLearnModeFilterOptions: any;

  constructor(
    private statisticsService: LearnStatisticsService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private modalService: ModalService,
  ) { }

  ngOnInit() {
    this.list();
  }

  // list statistics from server
  list() {
    this.statisticsService.list().subscribe({
      next: statistics => {
        this.statistics = statistics;
      },
      error: error => {
        this.toastr.error(this.translate.instant(error.error))
      }
    })
  }

  // Opening delete confirmation dialog to handle delete action
  openDeleteConfirmation(id: number) {
    this.modalService.openDeleteConfirmation(id, '', this.delete.bind(this));
  }

  // deleting statistics by id
  public delete(id: number) {
    this.statisticsService.delete(id).subscribe({
      next: _ => {
        this.toastr.success(this.translate.instant('DeleteSuccess'))
        this.list();
      },
      error: error => {
        this.toastr.error(this.translate.instant(error.error))
      }
    })
  }

  // Opening delete many confirmation dialog to handle deleteAll action
  openDeleteAllConfirmation() {
    this.modalService.openCustomConfirmation(0, this.deleteAll.bind(this), 'DeleteConfirmationTitle', 'DeleteManyConfirmationMessage');
  }

  //delete all
  deleteAll() {
    this.statisticsService.deleteAll().subscribe({
      next: _ => {
        this.toastr.success(this.translate.instant('DeleteSuccess'))
        this.list();
      },
      error: error => {
        this.toastr.error(this.translate.instant(error.error))
      }
    })
  }

  //Get translated text for enum
  getLearnModeLabel(mode: LearnModeType): string {
    switch (mode) {
      case LearnModeType.Flashcard:
        return this.translate.instant('Flashcard')
      case LearnModeType.Typing:
        return this.translate.instant('Typing')
      case LearnModeType.Selection:
        return this.translate.instant('Selection')
      case LearnModeType.Listening:
        return this.translate.instant('Listening')
      default:
        return '';
    }
  }
}
