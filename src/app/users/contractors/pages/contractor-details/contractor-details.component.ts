import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatAnchor } from '@angular/material/button';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '../../../../public/components/language-switcher/language-switcher.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatListItem, MatNavList} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';
import {AuthService} from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-contractor-details',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbar,
    MatToolbarRow,
    MatAnchor,
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    LanguageSwitcherComponent,
    MatSidenavModule,
    MatListItem,
    MatNavList,
    MatIcon
  ],
  templateUrl: './contractor-details.component.html',
  styleUrls: ['./contractor-details.component.css']
})
export class ContractorDetailsComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  project_id: number = 0;
  options = [
    { link: 'reports', label: 'detailsProjects.reports', icon: 'description' },
    { link: 'materials', label: 'detailsProjects.materials', icon: 'archive' },
    { link: 'workers', label: 'detailsProjects.workers', icon: 'group' },
    { link: 'incidents', label: 'detailsProjects.incidents', icon: 'warning' },
    { link: 'machinery', label: 'detailsProjects.machinery', icon: 'build' },
  ];

  constructor(
    private translate: TranslateService,
    private authService: AuthService
  ) {
    const id = this.route.snapshot.params['id'];
    this.project_id = id ? Number(id) : 0;
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  logout_() {
    this.authService.logout();
  }

}
