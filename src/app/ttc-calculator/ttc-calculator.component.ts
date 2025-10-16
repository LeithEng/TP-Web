import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ttc-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ttc-calculator.component.html',
})
export class TtcCalculatorComponent {
  
  unitPrice = signal(0);
  quantity = signal(1);
  tvaRate = signal(18);

  unitPriceTTC = computed(() => this.unitPrice() * (1 + this.tvaRate() / 100));

  totalPriceTTC = computed(() => this.unitPriceTTC() * this.quantity());

  discountRate = computed(() => 
    {
      if (this.quantity() >= 15) {
        return 30;
      } else if (this.quantity() >= 10) {
        return 20;
      } else {
        return 0;
      }
    }
  );
  
  discountAmount = computed(() => this.totalPriceTTC() * this.discountRate() / 100);

  finalPrice = computed(() => this.totalPriceTTC() - this.discountAmount());
}