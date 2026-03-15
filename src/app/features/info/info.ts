import { Component, inject, signal } from '@angular/core';
import { InputComponent, DialogComponent, ButtonComponent } from 'garaq-angular-components';
import { InfoService } from '../../service/info-service';
import { InfoModel } from '../../models/interfaces';
import { InfoComponent } from '../../shared/info-component/info-component';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionReloadCircle } from '@ng-icons/ionicons';

@Component({
  selector: 'app-info',
  imports: [InputComponent, InfoComponent, FormsModule, DialogComponent, ButtonComponent, NgIcon],
  providers: provideIcons({ ionReloadCircle }),
  templateUrl: './info.html',
  styleUrl: './info.css',
})
export class Info {
  private infoService = inject(InfoService);

  dialogOpen = signal<boolean>(false);
  name = signal<string>('');
  infoList = signal<InfoModel[]>([]);
  itemToDelete = signal<InfoModel | null>(null);
  loading = signal<boolean>(false);

  getInfoList() {
    this.infoService.getInfo(this.name()).subscribe((data) => this.infoList.set(data));
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
}
