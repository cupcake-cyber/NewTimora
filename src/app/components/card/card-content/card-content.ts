import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="classes">
      <ng-content></ng-content>
    </div>
  `,
})
export class CardContentComponent {

  @Input() className = '';


  @Input() padding: 'none' | 'sm' | 'md' | 'lg' = 'md';

  private paddingMap = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };

  get classes(): string {
    return [
      this.paddingMap[this.padding],
      this.className,
    ]
      .filter(Boolean)
      .join(' ');
  }
}