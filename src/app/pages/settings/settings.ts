import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CardComponent } from '../../components/card/card/card';
import { CardContentComponent } from '../../components/card/card-content/card-content';

import { Configuration } from '../../models/configuration';

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
export class SettingsComponent {

  config: Configuration = {
    notifyAppointments: true,
    notifyReservations: true,
    notifyCancellations: true,
    notifyReminders: true,

    appChannelEnabled: true,
    emailChannelEnabled: false,

    darkMode: true,

    reminderMinutesBefore: 30,
  };

  toggle<K extends keyof Configuration>(key: K) {
    this.config[key] = !this.config[key] as any;
  }

  updateReminder(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.config.reminderMinutesBefore = Number(value);
  }
}