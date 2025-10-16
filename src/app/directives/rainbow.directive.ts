import { Directive, HostBinding, HostListener, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

@Directive({
  selector: '[appRainbow]',
})
export class RainbowDirective implements OnInit, OnDestroy {

  private sub! : Subscription ;

  private colors: string[] = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
  @HostBinding('style.color') color: string = 'black';
  @HostBinding('style.border-color') borderColor: string = 'black';

  color$ = new BehaviorSubject<string>('black');
  
  @HostListener('keyup') onKeyUp() {
    this.color$.next(this.getRandomColor());
  }

  getRandomColor(): string {
    const randomIndex = Math.floor(Math.random() * this.colors.length);
    return this.colors[randomIndex];
  }

  ngOnInit(): void {
    this.sub = this.color$.subscribe(color => {
      console.log(color);
      this.color = color;
      this.borderColor = color;
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
