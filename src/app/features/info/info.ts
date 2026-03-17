import { Component, inject, signal } from '@angular/core';
import { InputComponent, DialogComponent, ButtonComponent } from 'garaq-angular-components';
import { InfoService } from '../../service/info-service';
import { Draw, InfoModel } from '../../models/interfaces';
import { InfoComponent } from '../../shared/info-component/info-component';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionAdd, ionReloadCircle, ionRemove } from '@ng-icons/ionicons';
import { DrawService } from '../../service/draw-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-info',
  imports: [InputComponent, InfoComponent, FormsModule, DialogComponent, ButtonComponent, NgIcon],
  providers: provideIcons({ ionReloadCircle, ionAdd, ionRemove }),
  templateUrl: './info.html',
  styleUrl: './info.css',
})
export class Info {
  private infoService = inject(InfoService);
  private drawService = inject(DrawService);
  private router = inject(Router);

  loadingList = signal<boolean>(true);
  dialogOpen = signal<boolean>(false);
  dialogDeleteAll = signal<boolean>(false);
  dialogSorteo = signal<boolean>(false);
  name = signal<string>('');
  infoList = signal<InfoModel[]>([]);
  winnersList = signal<InfoModel[]>([]);
  itemToDelete = signal<InfoModel | null>(null);
  loading = signal<boolean>(false);
  loadingDraw = signal<boolean>(false);
  winners = signal<number>(1);

  getInfoList() {
    this.loadingList.set(true);
    this.infoService.getInfo(this.name()).subscribe({
      next: (res) => {
        this.infoList.set(res);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.loadingList.set(false);
      },
    });
  }

  onSearch(value: string) {
    this.name.set(value);
    this.getInfoList();
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getInfoList();
  }

  setInfoToDelete(item: InfoModel) {
    this.itemToDelete.set(item);
    this.dialogOpen.set(true);
  }

  deleteAll() {
    this.loading.set(true);
    this.infoService.deleteAllRegisters().subscribe({
      next: () => {
        this.getInfoList();
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  onDeleteItem() {
    if (this.itemToDelete()?.winner === true) {
      alert('No se puede eliminar un ganador de un sorteo');
      return;
    }
    this.loading.set(true);
    if (this.itemToDelete()) {
      this.infoService.deleteInfo(this.itemToDelete()?.id!).subscribe({
        next: () => {
          this.dialogOpen.set(false);
          this.itemToDelete.set(null);
          this.getInfoList();
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

  doSorteo() {
    this.winnersList.set([]);
    while (this.winnersList().length < this.winners()) {
      const randomIndex = Math.floor(Math.random() * this.infoList().length);
      const selected = this.infoList()[randomIndex];
      if (!this.winnersList().some((winner) => winner.id === selected.id)) {
        this.winnersList.update((list) => [...list, selected]);
      }
    }
  }

  async saveDraw() {
    this.loadingDraw.set(true);
    for (const element of this.winnersList()) {
      await this.infoService.updateWinnerInfo(element.id!, true);
    }

    const draw: Draw = {
      winners: this.winnersList().map((winner) => winner.id!),
    }

    this.drawService.saveDraw(draw).subscribe({
      next: () => {
        alert('Sorteo guardado con exito');
        this.dialogSorteo.set(false);
        this.router.navigate(['draw']);
      },
      error: (error) => {
        alert(error.message);
        this.dialogSorteo.set(false);
      },
      complete: () => {
        this.loadingDraw.set(false);
        this.winnersList.set([]);
      },
    });
  }
}
