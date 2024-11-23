import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Equipment } from '../../interfaces';
import { CadetService } from '../../cadet.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.component.html',
})
export class InventoryComponent implements OnInit {
  items: Equipment[] = [];
  availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];
  selectedItemId: number | null = null;
  selectedSize: string = '';
  isConfirmed: boolean = false;
  cadetId: string = 'LKA12345678901';

  constructor(private cadetService: CadetService) {}

  ngOnInit(): void {
    this.cadetService.getAllEquipment(this.cadetId).subscribe(
      (data) => {
        this.items = data;
        console.log(data);
        
      },
      (error) => {
        console.error('Error fetching equipment:', error);
      }
    );
  }

  validateItem(itemId: number) {
    this.selectedItemId = itemId;
    this.selectedSize = '';
  }

  submitOrder() {
    if (this.selectedItemId !== null) {
      console.log(`Ordering new size ${this.selectedSize} for item ID ${this.selectedItemId}`);
      this.selectedItemId = null;
    }
  }

  cancelOrder() {
    this.selectedItemId = null;
  }
}
