import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="classes">
      <ng-content></ng-content>
    </div>
  `,
  host: {
    class: 'block w-full'
  }
})
export class CardComponent {

  @Input() cardClass = '';

  get classes(): string {
    return [
      'bg-card text-card-foreground rounded-xl border border-border',
      this.cardClass,
    ]
      .filter(Boolean)
      .join(' ');
  }
}