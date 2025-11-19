import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-two',
  templateUrl: './two.component.html',
  styleUrls: ['./two.component.css']
})
export class TwoComponent {
  two = 'init value';
}
