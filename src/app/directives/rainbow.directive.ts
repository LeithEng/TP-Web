import { Directive, ElementRef, HostBinding, HostListener, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, fromEvent, interval, map, Subject, Subscription, take, takeUntil } from 'rxjs';


@Directive({
  selector: 'input[appRainbow]',
})
export class RainbowDirective implements OnInit, OnDestroy {
  
  constructor(private elementRef: ElementRef) {}

    private colors: string[] = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
  
  @HostBinding('style.border-style') borderStyle = 'solid';
  @HostBinding('style.border-width') borderWidth = '2px';


  @HostBinding('style.color') color: string = 'black';
  @HostBinding('style.border-color') borderColor: string = 'black';

  private destroy$ = new Subject<void>();

  getRandomColor(): string {
    const randomIndex = Math.floor(Math.random() * this.colors.length);
    return this.colors[randomIndex];
  }

  ngOnInit(): void {
    fromEvent<KeyboardEvent>(this.elementRef.nativeElement, 'keyup')
      .pipe(
        map(() => this.getRandomColor()),
        takeUntil(this.destroy$)
      )
      .subscribe((color) => {
        this.color = color;
        this.borderColor = color;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  


}
