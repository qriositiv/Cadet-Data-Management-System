import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { ResultsComponent } from './components/results/results.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { EventsComponent } from './components/events/events.component';
import { PermissionsComponent } from './components/permissions/permissions.component';
import { AuthGuard } from './guards/auth.guard';
import { CareerComponent } from './components/career/career.component';
import { EfpaComponent } from './components/permissions/efpa/efpa.component';
import { CepComponent } from './components/permissions/cep/cep.component';
import { ResultsTableComponent } from './components/results-table/results-table.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'equipment', component: InventoryComponent, canActivate: [AuthGuard] },
  { path: 'permissions', component: PermissionsComponent, canActivate: [AuthGuard] },
  { path: 'permissions/cep', component: CepComponent, canActivate: [AuthGuard] },
  { path: 'permissions/efpa', component: EfpaComponent, canActivate: [AuthGuard] },
  { path: 'activities', component: EventsComponent, canActivate: [AuthGuard] },
  { path: 'results', component: ResultsComponent, canActivate: [AuthGuard] },
  { path: 'career', component: CareerComponent, canActivate: [AuthGuard] },
  { path: 'disciplines', component: ResultsTableComponent, canActivate: [AuthGuard] },
  { path: '**', component: NotFoundComponent },
];
