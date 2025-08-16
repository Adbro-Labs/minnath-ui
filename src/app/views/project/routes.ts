import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Projects'
    },
    children: [
      {
        path: 'list',
        loadComponent: () => import('./list-project/list-project.component').then(m => m.ListProjectComponent),
        data: {
          title: 'list'
        }
      },
      {
        path: 'byId/:id',
        loadComponent: () => import('./view-project/view-project.component').then(m => m.ViewProjectComponent),
        data: {
          title: 'project details'
        }
      },
      {
        path: 'invoices',
        loadComponent: () => import('./list-invoice/list-invoice.component').then(m => m.ListInvoiceComponent),
        data: {
          title: 'list'
        }
      },
      {
        path: 'statement',
        loadComponent: () => import('./statement-list/statement-list.component').then(m => m.StatementListComponent),
        data: {
          title: 'Account Statement'
        }
      },
      {
        path: 'manage-statement',
        loadComponent: () => import('./account-statement/account-statement.component').then(m => m.AccountStatementComponent),
        data: {
          title: 'Manage Statement'
        }
      }
    ]
  }
];

