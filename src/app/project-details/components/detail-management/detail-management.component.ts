import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatAnchor } from '@angular/material/button';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '../../../public/components/language-switcher/language-switcher.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatListItem, MatNavList} from '@angular/material/list';

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
    MatNavList
  ],
  templateUrl: './detail-management.component.html',
  styleUrls: ['./detail-management.component.css']
})
export class DetailManagementComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  project_id: number = 0;
  options = [
    { link: 'materials', label: 'materials' },
    { link: 'workers', label: 'workers' },
    { link: 'incidents', label: 'incidents' },
    { link: 'machinery', label: 'machinery' }
  ];

  constructor(private translate: TranslateService) {
    const id = this.route.snapshot.params['id'];
    this.project_id = id ? Number(id) : 0;
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }
}
