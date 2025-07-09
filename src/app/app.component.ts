import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {MatToolbar, MatToolbarRow} from '@angular/material/toolbar';
import {MatAnchor, MatButton} from '@angular/material/button';
import {LanguageSwitcherComponent} from './public/components/language-switcher/language-switcher.component';
import {AuthService} from './shared/services/auth.service';
import {MatIcon} from '@angular/material/icon';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatToolbar,
    MatToolbarRow,
    MatAnchor,
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    LanguageSwitcherComponent,
    MatIcon,
    MatButton,
    NgIf
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Arquitech';

  constructor(
    private translate: TranslateService,
    private authService: AuthService
  ) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  logout() {
    this.authService.logout();
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
