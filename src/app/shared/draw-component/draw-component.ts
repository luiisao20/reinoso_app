import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { DrawInfo } from '../../models/interfaces';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionCallSharp } from '@ng-icons/ionicons';
import { FormatDate } from '../../service/format-date';
import { ButtonComponent } from "garaq-angular-components";

@Component({
  selector: 'app-draw-component',
  imports: [NgIcon, ButtonComponent],
  providers: provideIcons({ ionCallSharp }),
  templateUrl: './draw-component.html',
  styleUrl: './draw-component.css',
})
export class DrawComponent {
  @Input() draw!: DrawInfo;
  @Output() selectInfoToDelete = new EventEmitter<DrawInfo>();

  private formatDate = inject(FormatDate);

  getDateFormatted() {
    return this.formatDate.formatTimeAgo(this.draw.createdAt);
  }

  onSelectToDelete(item: DrawInfo) {
    this.selectInfoToDelete.emit(item);
  }
}
