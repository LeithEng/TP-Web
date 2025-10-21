import { Component, computed, effect, OnInit, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-color-input',
  standalone: true,
  imports: [],
  templateUrl: './color-input.component.html',
  styleUrl: './color-input.component.css'
})
export class ColorInputComponent {

  color = signal<string>('black');

  lastValidColor = signal

  displayColor = computed(() =>
    this.validColors.includes(this.color()) ? this.color() : 'black'
  );

validColors: string[] = [
    'red', '#00ff00', '#0000ff', 
    '#000000', '#ffffff', 'orange', 
    'purple', 'pink','yellow', 'gray'
    , 'brown', 'cyan', 'magenta'
    , 'lime', 'navy', 'teal', 'olive'
    , 'maroon', 'silver', 'gold'
    ,'green'
  ];


}
