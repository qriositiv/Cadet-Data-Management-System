import { Component } from '@angular/core';
import { Equipment } from '../../../interfaces/interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-equipment-manager',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './equipment-manager.component.html'
})
export class EquipmentManagerComponent {
  equipmentList: Equipment[] = [
    {
      equipmentId: 1,
      cadetId: '12345',
      photoUrl: 'https://via.placeholder.com/100',
      status: 'Gauta',
      name: 'Helmet',
      sizes: ['S', 'M', 'L'],
      size: 'M',
      dateGiven: new Date(),
    },
    {
      equipmentId: 2,
      cadetId: '67890',
      photoUrl: 'https://via.placeholder.com/100',
      status: 'Negauta',
      name: 'Gloves',
      sizes: ['S', 'M', 'L'],
      size: '',
      dateGiven: new Date(),
    },
  ];

  approveEquipment(equipmentId: number) {
    const equipment = this.equipmentList.find((e) => e.equipmentId === equipmentId);
    if (equipment) {
      equipment.status = 'Patvirtintas';
    }
  }

  rejectEquipment(equipmentId: number) {
    const equipment = this.equipmentList.find((e) => e.equipmentId === equipmentId);
    if (equipment) {
      equipment.status = 'Atmesta';
    }
  }
}
