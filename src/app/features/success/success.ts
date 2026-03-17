import { Component, inject, signal } from '@angular/core';
import {AuthService} from '../../auth-service';

@Component({
  selector: 'app-success',
  imports: [],
  templateUrl: './success.html',
  styleUrl: './success.css',
})
export class Success {
  private authService = inject(AuthService);

  name = history.state.name;
  phone = history.state.phone;
}
