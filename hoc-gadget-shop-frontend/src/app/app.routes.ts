import { Routes } from '@angular/router';
import { InventoryComponent } from './AppComponents/inventory/inventory.component';
import { CustomersComponent } from './AppComponents/customers/customers.component';

export const routes: Routes = [
    {path: 'inventory', component:InventoryComponent},
    {path: 'customers', component:CustomersComponent},
];
