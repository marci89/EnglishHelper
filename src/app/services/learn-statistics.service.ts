import { Injectable } from '@angular/core';
import { BaseService } from '../common/services/base.service';
import { HttpClient } from '@angular/common/http';
import { CreateLearnStatisticsRequest, LearnStatistics, LearnStatisticsChart, ListLearnStatisticsChartRequest } from '../interfaces/learn-statistics.interface';

@Injectable({
  providedIn: 'root'
})
export class LearnStatisticsService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  //Get learn statistics list
  list() {
    return this.http.get<LearnStatistics[]>(this.baseUrl + 'LearnStatistics/list');
  }
  //Get learn statistics list for chart
  listForChart(request: ListLearnStatisticsChartRequest) {
    const params = this.createParams(request);
    return this.http.get<LearnStatisticsChart>(this.baseUrl + 'LearnStatistics/listForChart', { params });
  }

  //Create learn statistics
  create(request: CreateLearnStatisticsRequest) {
    return this.http.post<LearnStatistics>(this.baseUrl + 'LearnStatistics', request);
  }

  // Delete learn statistics by id
  delete(id: number) {
    return this.http.delete(`${this.baseUrl}LearnStatistics/${id}`);
  }

  // Delete all learn statistics by logined user id
  deleteAll() {
    return this.http.delete(`${this.baseUrl}LearnStatistics/deleteAll`);
  }
}
