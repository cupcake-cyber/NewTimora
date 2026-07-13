import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardComponent } from '../../../../components/card/card/card';
import { CommonModule } from '@angular/common';
import { CardContentComponent } from '../../../../components/card/card-content/card-content';

@Component({
  selector: 'app-settings-appearance-card',
  imports: [CommonModule, CardComponent, CardContentComponent],
  templateUrl: './settings-appearance-card.html',
  styleUrl: './settings-appearance-card.scss',
})
export class SettingsAppearanceCard {
  @Input() config!: any;

  @Output() toggle = new EventEmitter<string>();

  @Output() updateReminder = new EventEmitter<Event>();
}
