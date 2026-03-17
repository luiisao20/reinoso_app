import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormatDate {
  formatDatePretty(date: string | Date): string {
    const d = new Date(date);

    return new Intl.DateTimeFormat('es-EC', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(d);
  }

  formatTimeAgo(date: string | Date): string {
    const d = new Date(date);
    const now = new Date();

    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diff < 60) return 'Hace unos segundos';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
    if (diff < 2592000) return `Hace ${Math.floor(diff / 86400)} días`;

    return this.formatDatePretty(date);
  }
}
