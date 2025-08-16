import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Users'
    },
    children: [
      {
        path: 'list',
        loadComponent: () => import('./list-user/list-user.component').then(m => m.ListUserComponent),
        data: {
          title: 'list'
        }
      }
    ]
  }
];

