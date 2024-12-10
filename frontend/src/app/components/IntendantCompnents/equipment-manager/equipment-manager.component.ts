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
  equipmentList: Equipment[] = [];

  constructor(private intendantService: IntendantService) {}

  ngOnInit(): void {
    this.loadProcessingEquipment();
  }

  loadProcessingEquipment(): void {
    this.intendantService.getProcessingUserEquipment().subscribe(
      (data) => {
        this.equipmentList = data;
      },
      (error) => {
        console.error('Error fetching processing equipment:', error);
      }
    );
  }

  getEquipmentLeft(item: any): number | string {
    if (!item.sizes || !Array.isArray(item.sizes)) {
      return 'Nenurodyta';
    }
  
    const foundSize = item.sizes.find((s: any) => s.size === item.size);
    return foundSize ? foundSize.equipmentLeft : 'Nenurodyta';
  }

  updateEquipmentStatus(equipmentId: number, cadetId: string, newStatus: string) {
    this.intendantService.responseEquipment(equipmentId, cadetId, newStatus).subscribe(
      (response) => {
        console.log('Status updated successfully:', response);
        this.loadProcessingEquipment();
      },
      (error) => {
        console.error('Error updating status:', error);
      }
    );
  }
  
}
