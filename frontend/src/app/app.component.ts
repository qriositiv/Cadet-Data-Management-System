import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { CommonModule } from '@angular/common';
import { EventManagerComponent } from "./components/IntendantCompnents/event-manager/event-manager.component";
import { CepManagerComponent } from "./components/IntendantCompnents/cep-manager/cep-manager.component";
import { EfpaManagerComponent } from "./components/IntendantCompnents/efpa-manager/efpa-manager.component";
import { EquipmentManagerComponent } from "./components/IntendantCompnents/equipment-manager/equipment-manager.component";
import { ResultManagerComponent } from "./components/IntendantCompnents/result-manager/result-manager.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CommonModule, EventManagerComponent, CepManagerComponent, EfpaManagerComponent, EquipmentManagerComponent, ResultManagerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  email = 'info@kdvs.lt'

  isIntendant = localStorage.getItem('intendant') || 'false';
}
