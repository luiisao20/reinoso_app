import { Component, inject, signal } from '@angular/core';
import { DrawService } from '../../service/draw-service';
import { DrawInfo } from '../../models/interfaces';
import { DrawComponent } from "../../shared/draw-component/draw-component";

@Component({
  selector: 'app-draw-page',
  imports: [DrawComponent],
  templateUrl: './draw-page.html',
  styleUrl: './draw-page.css',
})
export class DrawPage {
  private drawService = inject(DrawService);

  drawList = signal<DrawInfo[]>([]);

  getDraws() {
    this.drawService.getDraws().subscribe((data) => this.drawList.set(data));
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getDraws();
  }
}
