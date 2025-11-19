import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-pere',
  templateUrl: './pere.component.html',
  styleUrls: ['./pere.component.css'],
})
export class PereComponent {
  onSendMessageToDad(message: string) {
    alert(message);
  }
}
