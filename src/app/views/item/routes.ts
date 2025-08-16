import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Itmems'
    },
    children: [
      {
        path: 'list',
        loadComponent: () => import('./list-items/list-items.component').then(m => m.ListItemsComponent),
        data: {
          title: 'list'
        }
      },
      {
        path: 'add-item',
        loadComponent: () => import('./add-item/add-item.component').then(m => m.AddItemComponent),
        data: {
          title: 'Add Items'
        }
      },
      {
        path: 'add-item-variants',
        loadComponent: () => import('./add-variants/add-variants.component').then(m => m.AddVariantsComponent),
        data: {
          title: 'Add item variants'
        }
      }
    ]
  }
];

