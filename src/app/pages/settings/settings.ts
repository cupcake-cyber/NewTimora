import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Subject, debounceTime } from 'rxjs';

import { CardComponent } from '../../components/card/card/card';
import { CardContentComponent } from '../../components/card/card-content/card-content';

import { Configuration } from '../../models/configuration';
import { ConfigurationService } from '../../services/configuration/configuration';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    CardContentComponent
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class SettingsComponent implements OnInit {

  private configurationService = inject(ConfigurationService);

  private configSubject = new Subject<Partial<Configuration>>();

  // 🔥 IMPORTANTE: ya no null → evita UI apagada al render inicial
  config: Configuration = {
    notifyAppointments: false,
    notifyReservations: false,
    notifyCancellations: false,
    notifyReminders: false,

    appChannelEnabled: false,
    emailChannelEnabled: false,

    darkMode: false,

    reminderMinutesBefore: 30,
  };

  ngOnInit(): void {
    this.initAutoSave();
    this.loadConfiguration();
  }

  // =========================
  // LOAD CONFIG
  // =========================
  private loadConfiguration(): void {
    this.configurationService.getMy().subscribe({
      next: (config) => {
        // 🔥 evita reemplazo de referencia (UI más estable)
        Object.assign(this.config, config);
      },
      error: (err) => {
        console.error('Error loading configuration', err);
      }
    });
  }

  // =========================
  // AUTO SAVE (PATCH STREAM)
  // =========================
  private initAutoSave(): void {
    this.configSubject
      .pipe(debounceTime(400))
      .subscribe((patch) => {
        this.configurationService.patch(patch).subscribe({
          error: (err) => {
            console.error('Error saving configuration', err);
          }
        });
      });
  }

  // =========================
  // TOGGLE
  // =========================
  toggle<K extends keyof Configuration>(key: K): void {
    if (!this.config) return;

    const current = this.config[key];

    if (typeof current === 'boolean') {
      this.config[key] = (!current) as Configuration[K];
    }

    this.configSubject.next({
      [key]: this.config[key]
    });
  }

  // =========================
  // SLIDER
  // =========================
  updateReminder(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);

    this.config.reminderMinutesBefore = value;

    this.configSubject.next({
      reminderMinutesBefore: value
    });
  }
}