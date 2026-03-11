import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-success',
  imports: [],
  templateUrl: './success.html',
  styleUrl: './success.css',
})
export class Success {
  name = history.state.name;
  phone = history.state.phone;
}
