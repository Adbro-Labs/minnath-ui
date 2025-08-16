import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Vehicles'
    },
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        loadComponent: () => import('./list-vehicle/list-vehicle.component').then(m => m.ListVehicleComponent),
        data: {
          title: 'list'
        }
      }
    ]
  }
];

