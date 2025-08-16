import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Banks'
    },
    children: [
      {
        path: 'list',
        loadComponent: () => import('./list-banks/list-banks.component').then(m => m.ListBanksComponent),
        data: {
          title: 'list'
        }
      }
    ]
  }
];

