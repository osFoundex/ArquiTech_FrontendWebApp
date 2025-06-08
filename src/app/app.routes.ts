import { Routes } from '@angular/router';
import { MaterialsManagementComponent } from './materials/pages/materials-management/materials-management.component';
import { workersManagementComponent } from './workers/pages/worker-management/worker-management.component';
import { IncidentManagementComponent } from './incidents/pages/incident-management/incident-management.component';
import { MachineryManagementComponent } from './machinery/pages/machinery-management/machinery-management.component';
import { ProjectManagementComponent } from './projects/pages/project-management/project-management.component';
import { DetailManagementComponent } from './users/supervisors/pages/detail-management/detail-management.component';
import {EntryDateComponent} from './materials/components/entry-date/entry-date.component';
import {ExitDateComponent} from './materials/components/exit-date/exit-date.component';
import { ContractorDetailsComponent } from './users/contractors/pages/contractor-details/contractor-details.component';
import { LogInComponent } from './shared/components/log-in/log-in.component';
import { authGuard } from './shared/services/auth.guard';
import {
  ProjectReportsContractorComponent
} from './users/contractors/pages/project-reports-contractor/project-reports-contractor.component';
import {MaterialsContractorComponent} from './materials/pages/materials-contractor/materials-contractor.component';
import {WorkerContractorComponent} from './workers/pages/worker-contractor/worker-contractor.component';
import {IncidentContractorComponent} from './incidents/pages/incident-contractor/incident-contractor.component';
import {MachineryContractorComponent} from './machinery/pages/machinery-contractor/machinery-contractor.component';
import {ProjectContractorComponent} from './projects/pages/project-contractor/project-contractor.component';

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
    component: ProjectContractorComponent,
    canActivate: [authGuard],
    data: { roles: ['Contractor'] } // Restrict to Contractor
  },
  {
    path: 'contractor/details/:id',
    component: ContractorDetailsComponent,
    canActivate: [authGuard],
    data: { roles: ['Contractor'] },
    children: [
      { path: '', redirectTo: 'reports', pathMatch: 'full' },
      { path: 'reports', component: ProjectReportsContractorComponent },
      { path: 'materials', component: MaterialsContractorComponent },
      { path: 'workers', component: WorkerContractorComponent },
      { path: 'incidents', component: IncidentContractorComponent },
      { path: 'machinery', component: MachineryContractorComponent }
    ]
  },
  { path: '**', loadComponent: PageNotFoundComponent }
];
