import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.component.html'
})
export class InventoryComponent {
  items = [
    {
      id: 1,
      status: 'wait',
      photo: 'https://via.placeholder.com/50', 
      name: 'Karo batai',
      size: '42',
      color: 'Juodas',
      dateGiven: new Date('2023-06-15'),
    },
    {
      id: 2,
      status: 'success',
      photo: 'https://via.placeholder.com/50',
      name: 'Uniform Jacket',
      size: 'L',
      color: 'Žalia',
      dateGiven: new Date('2023-05-20'),
    },
    {
      id: 3,
      status: 'fail',
      photo: 'https://via.placeholder.com/50',
      name: 'Žibintas',
      size: '-',
      color: 'Juodas',
      dateGiven: new Date('2023-05-23'),
    },
  ];

  availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];
  selectedItemId: number | null = null;
  selectedSize: string = '';

  validateItem(itemId: number) {
    this.selectedItemId = itemId;
    this.selectedSize = '';
  }

  submitOrder() {
    console.log(`Ordering new size ${this.selectedSize} for item ID ${this.selectedItemId}`);
    this.selectedItemId = null;
  }

  cancelOrder() {
    this.selectedItemId = null;
  }
}
