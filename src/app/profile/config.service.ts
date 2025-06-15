import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private MODO_OSCURO_KEY = 'modoOscuro';
  private CONTRASTE_KEY = 'contrasteAlto';

  setModoOscuro(valor: boolean): void {
    localStorage.setItem(this.MODO_OSCURO_KEY, JSON.stringify(valor));
    document.body.classList.toggle('modo-oscuro', valor);
  }

  getModoOscuro(): boolean {
    return JSON.parse(localStorage.getItem(this.MODO_OSCURO_KEY) || 'false');
  }

  setContrasteAlto(valor: boolean): void {
    localStorage.setItem(this.CONTRASTE_KEY, JSON.stringify(valor));
    document.body.classList.toggle('alto-contraste', valor);
  }

  getContrasteAlto(): boolean {
    return JSON.parse(localStorage.getItem(this.CONTRASTE_KEY) || 'false');
  }

  applyStoredPreferences(): void {
    document.body.classList.toggle('modo-oscuro', this.getModoOscuro());
    document.body.classList.toggle('alto-contraste', this.getContrasteAlto());
  }
}
