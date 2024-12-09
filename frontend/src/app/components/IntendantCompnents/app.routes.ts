import { Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { ProfileComponent } from '../cadetComponents/profile/profile.component';
import { HomeComponent } from '../home/home.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { EventsComponent } from '../cadetComponents/events/events.component';
import { AuthGuard } from '../../guards/auth.guard';
import { CareerComponent } from '../cadetComponents/career/career.component';
import { ResultsTableComponent } from '../cadetComponents/results-table/results-table.component';
import { NotificationsComponent } from '../cadetComponents/notifications/notifications.component';
import { InventoryComponent } from '../cadetComponents/inventory/inventory.component';
import { PermissionsComponent } from '../cadetComponents/permissions/permissions.component';
import { CepComponent } from '../cadetComponents/permissions/cep/cep.component';
import { EfpaComponent } from '../cadetComponents/permissions/efpa/efpa.component';
import { ResultsComponent } from '../cadetComponents/results/results.component';

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
