import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appRainbow]',
})
export class RainbowDirective {

  constructor() { }

  private colors: string[] = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
  @HostBinding('style.color') color: string = 'black';
  @HostBinding('style.border-color') borderColor: string = 'black';
  
  @HostListener('keyup') onKeyUp() {
    this.color = this.getRandomColor();
    this.borderColor = this.getRandomColor();
  }

  getRandomColor(): string {
    const randomIndex = Math.floor(Math.random() * this.colors.length);
    return this.colors[randomIndex];
  }
}
