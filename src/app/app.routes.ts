import { Routes } from '@angular/router';
import { MaterialsManagementComponent } from './materials/pages/materials-management/materials-management.component';
import { workersManagementComponent } from './workers/pages/worker-management/worker-management.component';
import { IncidentManagementComponent } from './incidents/pages/incident-management/incident-management.component';
import { MachineryManagementComponent } from './machinery/pages/machinery-management/machinery-management.component';
import { ProjectManagementComponent } from './projects/pages/project-management/project-management.component';
import { DetailManagementComponent } from './project-details/components/detail-management/detail-management.component';
import {EntryDateComponent} from './materials/components/entry-date/entry-date.component';
import {ExitDateComponent} from './materials/components/exit-date/exit-date.component';
import { ContractorDetailsComponent } from './contractors/pages/contractor-details/contractor-details.component';
import { LogInComponent } from './shared/components/log-in/log-in.component';
import { authGuard } from './shared/services/auth.guard';

const PageNotFoundComponent = () =>
  import('./public/pages/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent);

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LogInComponent },
  {
    path: 'projects',
    component: ProjectManagementComponent,
    canActivate: [authGuard],
    data: { roles: ['Supervisor'] } // Restrict to Supervisor
  },
  {
    path: 'details/:id',
    component: DetailManagementComponent,
    canActivate: [authGuard],
    data: { roles: ['Supervisor'] }, // Restrict to Supervisor
    children: [
      { path: '', redirectTo: 'materials', pathMatch: 'full' },
      { path: 'materials',
        component: MaterialsManagementComponent,
        children: [
          {path:'entry-date', component: EntryDateComponent},
          {path:'exit-date', component: ExitDateComponent}
        ]
      },
      { path: 'workers', component: workersManagementComponent },
      { path: 'incidents', component: IncidentManagementComponent },
      { path: 'machinery', component: MachineryManagementComponent }
    ]
  },
  {
    path: 'contractor/projects',
    component: ContractorDetailsComponent,
    canActivate: [authGuard],
    data: { roles: ['Contractor'] } // Restrict to Contractor
  },
  { path: '**', loadComponent: PageNotFoundComponent }
];
