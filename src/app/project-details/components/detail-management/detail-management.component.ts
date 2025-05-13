import {Component, inject} from '@angular/core';
import {ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatToolbar, MatToolbarRow} from '@angular/material/toolbar';
import {MatAnchor} from '@angular/material/button';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {LanguageSwitcherComponent} from '../../../public/components/language-switcher/language-switcher.component';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatNavList} from '@angular/material/list';

@Component({
  selector: 'app-detail-management',
  imports: [RouterOutlet, MatToolbar, MatToolbarRow, MatAnchor, RouterLink,
    RouterLinkActive, TranslatePipe, LanguageSwitcherComponent, MatSidenavModule, MatNavList],
  templateUrl: './detail-management.component.html',
  styleUrl: './detail-management.component.css'
})
export class DetailManagementComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  project_id: number = 0;
  options = [
    {link: 'materials', label: 'materials'},
    {link: 'workers', label: 'workers'},
    {link: 'incidents', label: 'incidents'},
    {link: 'machinery', label: 'machinery'}
  ];

  constructor(private translate: TranslateService) {
    // Obtener el parámetro 'id' de la ruta
    const id = this.route.snapshot.params['id'];
    this.project_id = id ? Number(id) : 0;
    console.log('Project ID:', this.project_id); // Depuración
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }
}
