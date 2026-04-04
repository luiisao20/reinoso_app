import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { InfoModel, PageResponse } from '../models/interfaces';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class InfoService {
  private http = inject(HttpClient);
  private URL_INFO = `${environment.apiUrl}/products`;

  saveInfo(info: InfoModel): Observable<InfoModel> {
    return this.http.post<InfoModel>(`${this.URL_INFO}/save`, info);
  }

  getInfoById(id: string): Promise<InfoModel | null> {
    return lastValueFrom(this.http.get<InfoModel>(`${this.URL_INFO}/${id}`)).catch(() => null);
  }

  updateWinnerInfo(id: string, winner: boolean): Promise<InfoModel | null> {
    return lastValueFrom(this.http.patch<InfoModel>(`${this.URL_INFO}/updateWinner/${id}`, winner));
  }

  getInfo(name?: string, page: number = 0, size: number = 10): Observable<PageResponse<InfoModel>> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    if (name) {
      params = params.append('name', name);
    }
    return this.http.get<PageResponse<InfoModel>>(`${this.URL_INFO}`, { params });
  }

  deleteInfo(id: string) {
    return this.http.delete(`${this.URL_INFO}/delete/${id}`);
  }

  deleteAllRegisters() {
    return this.http.delete(`${this.URL_INFO}/delete/all`);
  }
}
