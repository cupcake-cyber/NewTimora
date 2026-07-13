import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../../components/card/card/card';
import { CardContentComponent } from '../../../../components/card/card-content/card-content';

@Component({
  selector: 'app-settings-notifications-card',
  imports: [CommonModule, CardComponent, CardContentComponent],
  templateUrl: './settings-notifications-card.html',
  styleUrl: './settings-notifications-card.scss',
})
export class SettingsNotificationsCard {
  @Input() config!: any;

  @Output() toggle = new EventEmitter<string>();
}
