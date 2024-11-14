import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { ResultsComponent } from './components/results/results.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { EventsComponent } from './components/events/events.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'equipment', component: InventoryComponent },
  { path: 'permissions', component: NotFoundComponent },
  { path: 'activities', component: EventsComponent },
  { path: 'results', component: ResultsComponent },
];
