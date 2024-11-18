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
      id: 0,
      status: 'fail',
      photo: 'https://lpromo.lt/media/catalog/product/cache/1/thumbnail/600x/17f82f742ffe127f42dca9de82fb58b1/3/8/38081600001005.jpg', 
      name: 'Žygio kuprinė',
      size: '-',
      color: 'Juodas',
      dateGiven: new Date('2024-11-14'),
    },
    {
      id: 1,
      status: 'fail',
      photo: 'https://tyditiao.com/wp-content/uploads/2022/06/fast-Sand-color-Bulletproof-Kevlar-Helmet-main-view.jpg',
      name: 'Šalmas',
      size: 'M',
      color: 'Žalia',
      dateGiven: new Date('2024-11-14'),
    },
    {
      id: 2,
      status: 'fail',
      photo: 'https://ksd-images.lt/display/aikido/store/ed10d37fd1169ccc4a8f9b684ab44b8a.jpg',
      name: 'Žibintuvėlis',
      size: '-',
      color: 'Juodas',
      dateGiven: new Date('2024-11-14'),
    },
    {
      id: 3,
      status: 'fail',
      photo: 'https://www.lankava.lt/image/cache/mechanix-taktiniai-akiniai-type-x-juodi-skaidri-linze_202312120855481-1000x1000.jpg',
      name: 'Taktiniai akiniai',
      size: '-',
      color: 'Juodas',
      dateGiven: new Date('2024-11-14'),
    },
    {
      id: 4,
      status: 'fail',
      photo: 'https://balticshooter.lt/image/cache/data/products_s_1/taktine-liemene-perun-4-20-rb-su-greito-atsegimo-sagtimis-v-pc-p4-20rocrg-321-625x625_0.jpg',
      name: 'Taktinė liemenė',
      size: '-',
      color: 'Juodas',
      dateGiven: new Date('2024-11-14'),
    },
    {
      id: 5,
      status: 'fail',
      photo: 'https://www.aic.lt/14387-medium_default/palapinsiauste-mil-tec-rip-stop-woodland.jpg',
      name: 'Palapinsiaustė',
      size: '-',
      color: 'Juodas',
      dateGiven: new Date('2024-11-14'),
    },
    {
      id: 6,
      status: 'success',
      photo: 'https://matuza-tactical.lt/wp-content/uploads/2020/11/5-1-scaled.jpg',
      name: 'Gertuvė',
      size: '-',
      color: 'Juodas',
      dateGiven: new Date('2024-11-14'),
    },
    {
      id: 7,
      status: 'wait',
      photo: 'https://www.aic.lt/8044-medium_default/metalinis-puodukas-gertuvei.jpg',
      name: 'Maisto katilukas',
      size: '-',
      color: 'Juodas',
      dateGiven: new Date('2024-11-14'),
    },
    {
      id: 8,
      status: 'important',
      photo: 'https://www.aic.lt/5240-large_default/taktines-pirstines-arsenal-swat-be-pirstu-l.jpg',
      name: 'Taktinės pirštines',
      size: 'M',
      color: 'Juodas',
      dateGiven: new Date('2024-11-14'),
    },
    {
      id: 9,
      status: 'fail',
      photo: 'https://edesys.lt/image/cache/catalog/start-riding/4525-600x600.jpg',
      name: 'Žieminės pirštines',
      size: 'M',
      color: 'Juodas',
      dateGiven: new Date('2024-11-14'),
    },
    {
      id: 10,
      status: 'fail',
      photo: 'https://www.aic.lt/22324-large_default/zieminiai-batai-demar-caribou-pro-40.jpg',
      name: 'Žieminiai batai',
      size: '-',
      color: 'Juodas',
      dateGiven: new Date('2024-11-14'),
    },
    {
      id: 10,
      status: 'fail',
      photo: '',
      name: 'Vasariniai batai',
      size: '-',
      color: 'Juodas',
      dateGiven: new Date('2024-11-14'),
    },
  ];

  availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];
  selectedItemId: number | null = null;
  selectedSize: string = '';
  isConfirmed: boolean = false;

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
