import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CadetService } from '../../../services/cadet.service';
import { Equipment } from '../../../interfaces/interfaces';

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
  cadetId: any = localStorage.getItem('cadetId');
  status: string = 'Apdorojama';

  constructor(private cadetService: CadetService) {}

  ngOnInit(): void {
    this.loadEquipment();
  }

  loadEquipment() {
    this.cadetService.getAllEquipment(this.cadetId).subscribe(
      (data) => {
        this.items = data;
      },
      (error) => {
        console.error('Error fetching equipment:', error);
      }
    );
  }

  validateItem(itemId: number) {
    this.selectedItemId = itemId;
    this.selectedSize = '';
    this.status = 'Apdorojama';
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
          this.selectedItemId = null;
          this.loadEquipment();
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
