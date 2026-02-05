import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Clients'
    },
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        loadComponent: () => import('./list-client/list-client.component').then(m => m.ListClientComponent),
        data: {
          title: 'list'
        }
      }
      ,
      {
        path: 'manage-docs',
        loadComponent: () => import('./manage-docs/manage-docs.component').then(m => m.ManageDocsComponent),
        data: {
          title: 'Manage Docs'
        }
      }
    ]
  }
];

