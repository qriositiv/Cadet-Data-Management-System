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
  items: Equipment[] = []; // List of equipment items
  selectedItemId: number | null = null; // Currently selected equipment item for validation
  selectedSize: string = ''; // Size selected for the equipment
  isConfirmed: boolean = false; // Confirmation flag for order submission
  cadetId: any = localStorage.getItem('cadetId'); // Retrieve cadet ID from local storage
  status: string = 'Apdorojama'; // Default status for new equipment orders

  constructor(private cadetService: CadetService) {}

  // Load equipment data when the component initializes
  ngOnInit(): void {
    this.loadEquipment();
  }

  // Fetches the list of equipment assigned to the cadet
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

  // Prepares an item for order validation
  validateItem(itemId: number) {
    this.selectedItemId = itemId;
    this.selectedSize = ''; // Reset selected size
    this.status = 'Apdorojama'; // Set default status
  }

  // Submits the selected equipment order
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
          this.selectedItemId = null; // Reset selected item
          this.loadEquipment(); // Reload updated equipment list
        },
        (error) => {
          console.error('Error submitting order:', error);
        }
      );
    } else {
      console.error('Please select size and status.');
    }
  }

  // Cancels the order and resets the form state
  cancelOrder() {
    this.selectedItemId = null;
    this.selectedSize = '';
    this.status = '';
  }
}
