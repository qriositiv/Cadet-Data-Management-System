import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { NotificationsComponent } from './components/cadetComponents/notifications/notifications.component';
import { ProfileComponent } from './components/cadetComponents/profile/profile.component';
import { InventoryComponent } from './components/cadetComponents/inventory/inventory.component';
import { PermissionsComponent } from './components/cadetComponents/permissions/permissions.component';
import { CepComponent } from './components/cadetComponents/permissions/cep/cep.component';
import { EfpaComponent } from './components/cadetComponents/permissions/efpa/efpa.component';
import { EventsComponent } from './components/cadetComponents/events/events.component';
import { ResultsComponent } from './components/cadetComponents/results/results.component';
import { CareerComponent } from './components/cadetComponents/career/career.component';
import { ResultsTableComponent } from './components/cadetComponents/results-table/results-table.component';
import { EquipmentManagerComponent } from './components/IntendantCompnents/equipment-manager/equipment-manager.component';
import { CepManagerComponent } from './components/IntendantCompnents/cep-manager/cep-manager.component';
import { EfpaManagerComponent } from './components/IntendantCompnents/efpa-manager/efpa-manager.component';
import { EventManagerComponent } from './components/IntendantCompnents/event-manager/event-manager.component';
import { ResultManagerComponent } from './components/IntendantCompnents/result-manager/result-manager.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

// Define application routes
export const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Login page
  { path: '', component: HomeComponent, canActivate: [AuthGuard] }, // Home page (requires authentication)
  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] }, // Notifications (authenticated users only)
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] }, // User profile
  { path: 'equipment', component: InventoryComponent, canActivate: [AuthGuard] }, // Equipment list
  { path: 'permissions', component: PermissionsComponent, canActivate: [AuthGuard] }, // General permissions page
  { path: 'permissions/cep', component: CepComponent, canActivate: [AuthGuard] }, // Car entry permissions
  { path: 'permissions/efpa', component: EfpaComponent, canActivate: [AuthGuard] }, // Exemption from physical activity
  { path: 'activities', component: EventsComponent, canActivate: [AuthGuard] }, // Event list
  { path: 'results', component: ResultsComponent, canActivate: [AuthGuard] }, // Discipline results
  { path: 'career', component: CareerComponent, canActivate: [AuthGuard] }, // Career-related information
  { path: 'disciplines', component: ResultsTableComponent, canActivate: [AuthGuard] }, // List of disciplines and control values

  // Restricted routes for 'intendantas' role
  {
    path: 'manage/equipment',
    component: EquipmentManagerComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'intendantas' }, // Accessible only by 'intendantas' role
  },
  {
    path: 'manage/permissions/cep',
    component: CepManagerComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'intendantas' },
  },
  {
    path: 'manage/permissions/efpa',
    component: EfpaManagerComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'intendantas' },
  },
  {
    path: 'manage/activities',
    component: EventManagerComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'intendantas' },
  },
  {
    path: 'manage/results',
    component: ResultManagerComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'intendantas' },
  },

  { path: '**', component: NotFoundComponent }, // Catch-all for undefined routes
];
