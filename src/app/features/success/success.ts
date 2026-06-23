import { Component } from '@angular/core';

@Component({
  selector: 'app-success',
  imports: [],
  templateUrl: './success.html',
  styleUrl: './success.css',
})
export class Success {
  name: string = history.state.name;
  category: string = history.state.category;
}
