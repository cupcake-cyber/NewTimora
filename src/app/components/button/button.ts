import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';

type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

const BASE =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap ' +
  'rounded-md text-sm font-medium transition-colors ' +
  'disabled:pointer-events-none disabled:opacity-50 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

const VARIANT: Record<ButtonVariant, string> = {
  default: 'bg-primary text-primary-foreground hover:opacity-90',
  destructive: 'bg-red-500 text-white hover:bg-red-600',
  outline: 'border border-border bg-transparent hover:bg-secondary',
  secondary: 'bg-secondary text-secondary-foreground hover:opacity-80',
  ghost: 'hover:bg-secondary',
  link: 'text-primary underline-offset-4 hover:underline',
};

const SIZE: Record<ButtonSize, string> = {
  default: 'h-10 px-4 py-2',
  sm: 'h-8 px-3 text-sm',
  lg: 'h-11 px-6 text-base',
  icon: 'h-10 w-10',
};

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [attr.type]="type"
      [disabled]="disabled"
      [class]="classes"
    >
      <ng-content></ng-content>
    </button>
  `,
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'default';
  @Input() size: ButtonSize = 'default';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  @Input('class') className = '';

  get classes(): string {
    return [BASE, VARIANT[this.variant], SIZE[this.size], this.className]
      .filter(Boolean)
      .join(' ');
  }
}