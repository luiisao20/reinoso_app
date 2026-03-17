import { Component, inject, signal } from '@angular/core';
import { DrawService } from '../../service/draw-service';
import { DrawInfo } from '../../models/interfaces';
import { DrawComponent } from '../../shared/draw-component/draw-component';
import { DialogComponent, ButtonComponent } from 'garaq-angular-components';
import { InfoService } from '../../service/info-service';

@Component({
  selector: 'app-draw-page',
  imports: [DrawComponent, DialogComponent, ButtonComponent],
  templateUrl: './draw-page.html',
  styleUrl: './draw-page.css',
})
export class DrawPage {
  private drawService = inject(DrawService);
  private infoService = inject(InfoService);

  drawList = signal<DrawInfo[]>([]);
  drawToDelete = signal<DrawInfo | null>(null);
  dialogOpen = signal<boolean>(false);
  loading = signal<boolean>(false);

  getDraws() {
    this.drawService.getDraws().subscribe((data) => this.drawList.set(data));
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getDraws();
  }

  selectDrawToDelete(item: DrawInfo) {
    this.drawToDelete.set(item);
    this.dialogOpen.set(true);
  }

  async onDeleteItem() {
    if (!this.drawToDelete()) return;
    this.loading.set(true);

    for (const element of this.drawToDelete()?.infos!) {
      await this.infoService.updateWinnerInfo(element.id!, false);
    }

    this.drawService.deleteDraw(this.drawToDelete()?.id!).subscribe({
      next: () => {
        this.getDraws();
        this.dialogOpen.set(false);
        alert('El sorteo se ha eliminado correctamente');
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }
}
