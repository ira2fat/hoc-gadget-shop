import { Routes } from '@angular/router';
import { InventoryComponent } from './AppComponents/inventory/inventory.component';
import { CustomersComponent } from './AppComponents/customers/customers.component';
import { AboutComponent } from './AppComponents/about/about.component';

export const routes: Routes = [
  { path: '', redirectTo: '/about', pathMatch: 'full' },
  { path: 'about', component: AboutComponent },
  { path: 'inventory', component: InventoryComponent },
  { path: 'customers', component: CustomersComponent },
  { path: '**', redirectTo: '/about' }
];
