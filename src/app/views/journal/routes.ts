import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Journal'
    },
    children: [
      {
        path: 'list',
        loadComponent: () => import('./list-journal/list-journal.component').then(m => m.ListJournalComponent),
        data: {
          title: 'list'
        }
      },
      {
        path: 'events',
        loadComponent: () => import('./list-journal-events/list-journal-events.component').then(m => m.ListJournalEventsComponent),
        data: {
          title: 'Journal Events'
        }
      },
      {
        path: 'heads',
        loadComponent: () => import('./list-journal-head/list-journal-head.component').then(m => m.ListJournalHeadComponent),
        data: {
          title: 'Journal Heads'
        }
      }
    ]
  }
];

