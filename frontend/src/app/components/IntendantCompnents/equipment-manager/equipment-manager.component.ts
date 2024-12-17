import { Component } from '@angular/core';
import { Equipment } from '../../../interfaces/interfaces';
import { CommonModule } from '@angular/common';
import { IntendantService } from '../../../services/intendant.service';

@Component({
  selector: 'app-equipment-manager',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './equipment-manager.component.html'
})
export class EquipmentManagerComponent {
  // List of equipment currently being processed
  equipmentList: Equipment[] = [];

  constructor(private intendantService: IntendantService) {}

  /**
   * Lifecycle hook: Initializes the component by loading processing equipment.
   */
  ngOnInit(): void {
    this.loadProcessingEquipment();
  }

  /**
   * Fetches equipment currently being processed from the server.
   */
  loadProcessingEquipment(): void {
    this.intendantService.getProcessingUserEquipment().subscribe(
      (data) => {
        this.equipmentList = data; // Populate the equipment list
      },
      (error) => {
        console.error('Error fetching processing equipment:', error); // Log errors
      }
    );
  }

  /**
   * Retrieves the remaining quantity for a specific size of equipment.
   *
   * @param item - The equipment item to check
   * @returns The remaining quantity for the selected size or 'Nenurodyta' if not available
   */
  getEquipmentLeft(item: any): number | string {
    if (!item.sizes || !Array.isArray(item.sizes)) {
      return 'Nenurodyta'; // Return 'Nenurodyta' if sizes are not defined or invalid
    }

    const foundSize = item.sizes.find((s: any) => s.size === item.size); // Find the size
    return foundSize ? foundSize.equipmentLeft : 'Nenurodyta'; // Return the remaining quantity or 'Nenurodyta'
  }

  /**
   * Updates the status of equipment for a cadet.
   *
   * @param equipmentId - The ID of the equipment to update
   * @param cadetId - The ID of the cadet
   * @param newStatus - The new status for the equipment
   */
  updateEquipmentStatus(equipmentId: number, cadetId: string, newStatus: string): void {
    this.intendantService.responseEquipment(equipmentId, cadetId, newStatus).subscribe(
      (response) => {
        this.loadProcessingEquipment(); // Reload the equipment list after updating the status
      },
      (error) => {
        console.error('Error updating status:', error); // Log any errors
      }
    );
  }
}
