import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Draw, DrawInfo } from '../models/interfaces';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DrawService {
  private http = inject(HttpClient);
  private URL_INFO = `${environment.apiUrl}/draws`;

  getDraws() {
    return this.http.get<DrawInfo[]>(`${this.URL_INFO}`);
  }

  getDrawById(id: number): Promise<DrawInfo | null> {
    return lastValueFrom(this.http.get<DrawInfo>(`${this.URL_INFO}/${id}`));
  }

  doDraw(size: number = 1): Promise<DrawInfo> {
    const params = new HttpParams().set('size', size.toString());
    return lastValueFrom(this.http.get<DrawInfo>(`${this.URL_INFO}/do`, { params }));
  }

  deleteDraw(id: number) {
    return this.http.delete(`${this.URL_INFO}/delete/${id}`);
  }

  saveDraw(draw: Draw): Observable<Draw> {
    return this.http.post<Draw>(`${this.URL_INFO}/save`, draw);
  }
}
