import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatAnchor } from '@angular/material/button';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '../../../../public/components/language-switcher/language-switcher.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatListItem, MatNavList} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-detail-management',
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
  templateUrl: './detail-management.component.html',
  styleUrls: ['./detail-management.component.css']
})
export class DetailManagementComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  project_id: number = 0;
  options = [
    { link: 'materials', label: 'detailsProjects.materials', icon: 'archive' },
    { link: 'workers', label: 'detailsProjects.workers', icon: 'group' },
    { link: 'incidents', label: 'detailsProjects.incidents', icon: 'warning' },
    { link: 'machinery', label: 'detailsProjects.machinery', icon: 'build' },
  ];

  constructor(private translate: TranslateService) {
    const id = this.route.snapshot.params['id'];
    this.project_id = id ? Number(id) : 0;
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }
}
