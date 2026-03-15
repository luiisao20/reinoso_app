import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InfoModel } from '../../models/interfaces';
import { matDelete, matDirectionsRun } from '@ng-icons/material-icons/baseline';
import { NgIcon, provideIcons } from '@ng-icons/core';

@Component({
  selector: 'app-info-component',
  imports: [NgIcon],
  providers: provideIcons({ matDirectionsRun, matDelete }),
  templateUrl: './info-component.html',
  styleUrl: './info-component.css',
})
export class InfoComponent {
  @Input() item!: InfoModel;
  @Output() selectInfoToDelete = new EventEmitter<InfoModel>();

  onSelectToDelete(item: InfoModel) {
    this.selectInfoToDelete.emit(item);
  }
}
