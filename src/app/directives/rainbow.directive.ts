import { computed, Directive, Host, HostBinding, signal } from '@angular/core';

@Directive({
  selector: 'input[appRainbow]',
  standalone: true,
  host: {
    '(keyup)': 'onKeyUp()'
  }
})
export class RainbowDirective {

  private colors: string[] = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
  color = signal('black');

  getRandomColor(): string {
    const randomIndex = Math.floor(Math.random() * this.colors.length);
    return this.colors[randomIndex];
  }
  
  onKeyUp(): void {
    this.color.set(this.getRandomColor());
    console.log(this.color());
  }

  @HostBinding('style.color')
  get hostColor() : string { return this.color()};
  

  @HostBinding('style.border-color')
  get hostBorderColor(): string { return this.color(); }

}
