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
  selectedItemId: number | null = null;
  selectedSize: string = '';
  isConfirmed: boolean = false;
  cadetId: string = 'LKA12345678901';
  status: string = 'wait';

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
    this.status = 'wait';
  }

  submitOrder() {
    if (this.selectedItemId !== null && this.selectedSize) {
      const orderData = {
        cadetId: this.cadetId,
        equipmentId: this.selectedItemId,
        size: this.selectedSize,
        status: this.status,
      };
  
      this.cadetService.updateUserEquipment(orderData).subscribe(
        (response) => {
          console.log('Order submitted successfully', response);
          this.selectedItemId = null;
        },
        (error) => {
          console.error('Error submitting order:', error);
        }
      );
    } else {
      console.error('Please select size and status.');
    }
  }
  

  cancelOrder() {
    this.selectedItemId = null;
    this.selectedSize = '';
    this.status = '';
  }
}
