import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  private http = inject(HttpClient);
  private URL_INFO = `${environment.apiUrl}/export`;

  getExcel() {
    return lastValueFrom(this.http.get(`${this.URL_INFO}/excel`, { responseType: 'blob' }));
  }
}
