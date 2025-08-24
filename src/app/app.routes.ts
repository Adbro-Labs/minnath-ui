import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { authGuard } from "./utils/guards/auth.guard";

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'theme',
        loadChildren: () => import('./views/theme/routes').then((m) => m.routes)
      },
      {
        path: 'base',
        loadChildren: () => import('./views/base/routes').then((m) => m.routes)
      },
      {
        path: 'buttons',
        loadChildren: () => import('./views/buttons/routes').then((m) => m.routes)
      },
      {
        path: 'forms',
        loadChildren: () => import('./views/forms/routes').then((m) => m.routes)
      },
      {
        path: 'icons',
        loadChildren: () => import('./views/icons/routes').then((m) => m.routes)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./views/notifications/routes').then((m) => m.routes)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/routes').then((m) => m.routes)
      },
      {
        path: 'charts',
        loadChildren: () => import('./views/charts/routes').then((m) => m.routes)
      },
      {
        path: 'pages',
        loadChildren: () => import('./views/pages/routes').then((m) => m.routes)
      },
      {
        path: 'banks',
        loadChildren: () => import('./views/bank/routes').then((m) => m.routes)
      },
      {
        path: 'client',
        loadChildren: () => import('./views/client/routes').then((m) => m.routes)
      },
      {
        path: 'project',
        loadChildren: () => import('./views/project/routes').then((m) => m.routes)
      },
      {
        path: 'location',
        loadChildren: () => import('./views/location/routes').then((m) => m.routes)
      },
      {
        path: 'vehicle',
        loadChildren: () => import('./views/vehicle/routes').then((m) => m.routes)
      },
      {
        path: 'journal',
        loadChildren: () => import('./views/journal/routes').then((m) => m.routes)
      },
      {
        path: 'ledger',
        loadChildren: () => import('./views/ledger/routes').then((m) => m.routes)
      },
      {
        path: 'users',
        loadChildren: () => import('./views/users/routes').then((m) => m.routes)
      },
      {
        path: 'items',
        loadChildren: () => import('./views/item/routes').then((m) => m.routes)
      },
      {
        path: 'create-quote',
        loadComponent: () => import('./views/project/generate-quotes/generate-quotes.component').then(m => m.GenerateQuoteComponent),
        data: {
          title: 'Create Quote'
        }
      },
      {
        path: 'list-quote',
        loadComponent: () => import('./views/project/generated-quotes/generated-quotes.component').then(m => m.GeneratedQuotesComponent),
        data: {
          title: 'Generated Quotes'
        }
      }
    ],
    canActivate: [authGuard]
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  },
  { path: '**', redirectTo: 'dashboard' }
];
