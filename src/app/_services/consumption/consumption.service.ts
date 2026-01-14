import { Injectable, signal, Signal } from '@angular/core';

export type ConsumptionMode = 'on-site' | 'takeaway' | null;

@Injectable({
  providedIn: 'root'
})
export class ConsumptionService {
  private readonly STORAGE_KEY = 'consumptionMode';
  private consumptionModeSignal = signal<ConsumptionMode>(this.getStoredMode());
  readonly consumptionMode: Signal<ConsumptionMode> = this.consumptionModeSignal.asReadonly();

  constructor() {}

  getCurrentMode(): ConsumptionMode {
    return this.consumptionModeSignal();
  }

  setMode(mode: ConsumptionMode): void {
    this.consumptionModeSignal.set(mode);
    if (mode) {
      localStorage.setItem(this.STORAGE_KEY, mode);
    } else {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  private getStoredMode(): ConsumptionMode {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return (stored as ConsumptionMode) || null;
  }
}
