import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { InfoModel } from '../models/interfaces';
import { Observable } from 'rxjs';
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

  getInfo(name?: string): Observable<InfoModel[]> {
    let params = new HttpParams();
    if (name) {
      params = params.append('name', name);
    }
    return this.http.get<InfoModel[]>(`${this.URL_INFO}`, { params });
  }

  deleteInfo(id: number) {
    return this.http.delete(`${this.URL_INFO}/delete/${id}`);
  }

  deleteAllRegisters() {
    return this.http.delete(`${this.URL_INFO}/delete/all`);
  }
}
