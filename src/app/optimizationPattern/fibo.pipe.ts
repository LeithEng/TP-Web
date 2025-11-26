import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fibo',
  pure: true,
})
export class FiboPipe implements PipeTransform {
  private cache = new Map<number, number>();

  transform(n: number): number {
    if (n == null || n < 0) return 0;
    const key = Math.floor(n);
    if (this.cache.has(key)) return this.cache.get(key)!;
    const result = this.computeFibo(key);
    this.cache.set(key, result);
    return result;
  }

  private computeFibo(n: number): number {
    if (n <= 1) return 1;
    let a = 1,
      b = 1;
    for (let i = 2; i <= n; i++) {
      const c = a + b;
      a = b;
      b = c;
    }
    return b;
  }
}
