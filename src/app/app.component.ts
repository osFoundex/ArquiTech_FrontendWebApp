import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {MatToolbar, MatToolbarRow} from '@angular/material/toolbar';
import {MatAnchor} from '@angular/material/button';
import {LanguageSwitcherComponent} from './public/components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbar, MatToolbarRow, MatAnchor, RouterLink,
    RouterLinkActive, TranslatePipe, LanguageSwitcherComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Arquitech';



  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }
}
