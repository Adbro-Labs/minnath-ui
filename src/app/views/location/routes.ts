import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Locations'
    },
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        loadComponent: () => import('./list-location/list-location.component').then(m => m.ListLocationComponent),
        data: {
          title: 'list'
        }
      }
    ]
  }
];

