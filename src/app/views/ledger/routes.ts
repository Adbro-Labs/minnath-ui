import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Ledger'
    },
    children: [
      {
        path: 'list',
        loadComponent: () => import('./view-ledger/view-ledger.component').then(m => m.ViewLedgerComponent),
        data: {
          title: 'list'
        }
      }
    ]
  }
];

