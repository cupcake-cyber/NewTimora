import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../../components/card/card/card';
import { CardContentComponent } from '../../../../components/card/card-content/card-content';

@Component({
  selector: 'app-settings-channels-card',
  imports: [CommonModule, CardComponent, CardContentComponent],
  templateUrl: './settings-channels-card.html',
  styleUrl: './settings-channels-card.scss',
})
export class SettingsChannelsCard {
  @Input() config!: any;

  @Output() toggle = new EventEmitter<string>();
}
