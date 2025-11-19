import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-ngstyle',
  templateUrl: './ngstyle.component.html',
  styleUrls: ['./ngstyle.component.css'],
})
export class NgstyleComponent {
  @Input() color = 'lightgreen';
}
