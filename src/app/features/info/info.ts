import { Component, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { InputComponent, DialogComponent, ButtonComponent } from 'garaq-angular-components';
import { InfoService } from '../../service/info-service';
import { Draw, InfoModel, PageResponse } from '../../models/interfaces';
import { InfoComponent } from '../../shared/info-component/info-component';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionAdd, ionReloadCircle, ionRemove } from '@ng-icons/ionicons';
import { DrawService } from '../../service/draw-service';
import { Router } from '@angular/router';
import { injectInfiniteQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { ExcelService } from '../../service/excel-service';

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
  private excelService = inject(ExcelService);
  private router = inject(Router);

  loadingExcel = signal<boolean>(false);
  dialogOpen = signal<boolean>(false);
  dialogDeleteAll = signal<boolean>(false);
  dialogSorteo = signal<boolean>(false);
  name = signal<string>('');
  infoList = signal<PageResponse<InfoModel> | null>(null);
  winnersList = signal<InfoModel[]>([]);
  itemToDelete = signal<InfoModel | null>(null);
  loading = signal<boolean>(false);
  loadingDraw = signal<boolean>(false);
  winners = signal<number>(1);
  total = signal<number>(0);

  query = injectInfiniteQuery(() => ({
    queryKey: ['infos', this.name()],
    queryFn: async ({ pageParam }) => {
      const res = await lastValueFrom(this.infoService.getInfo(this.name(), pageParam, 10));
      this.total.set(res.totalElements);
      return res;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
  }));

  onSearch(value: string) {
    this.name.set(value);
  }

  async exportExcel() {
    this.loadingExcel.set(true);
    try {
      const blob = await this.excelService.getExcel();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'participantes.xlsx';
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al descargar el Excel', error);
    } finally {
      this.loadingExcel.set(false);
    }
  }

  setInfoToDelete(item: InfoModel) {
    this.itemToDelete.set(item);
    this.dialogOpen.set(true);
  }

  deleteAll() {
    this.loading.set(true);
    this.infoService.deleteAllRegisters().subscribe({
      next: () => {
        this.query.refetch();
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
          this.query.refetch();
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

  async doSorteo() {
    this.winnersList.set([]);
    const res = await this.drawService.doDraw(this.winners());
    this.winnersList.set(res.infos);
  }

  async saveDraw() {
    this.loadingDraw.set(true);
    for (const element of this.winnersList()) {
      await this.infoService.updateWinnerInfo(element.id!, true);
    }

    const draw: Draw = {
      winners: this.winnersList().map((winner) => winner.id!),
    };

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

  loadMore() {
    if (this.query.isFetching()) return;
    if (this.query.hasNextPage() && !this.query.isFetchingNextPage()) {
      this.query.fetchNextPage();
    }
  }

  anchor = viewChild<ElementRef>('infiniteAnchor');

  constructor() {
    effect(() => {
      const el = this.anchor()?.nativeElement;
      if (!el) return;

      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          this.loadMore();
        }
      });

      observer.observe(el);
    });
  }
}
