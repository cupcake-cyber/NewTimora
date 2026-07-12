import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ServiceDTO } from '../../../../models/service';

@Component({
  selector: 'app-services-delete-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, DialogModule, ButtonModule],
  templateUrl: './services-delete-modal.html',
  styleUrls: ['./services-delete-modal.scss'],
})
export class ServicesDeleteModal {
  @Input() visible = false;
  @Input() service: ServiceDTO | null = null;
  @Input() loading = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  icons = { X };

  onCancel(): void {
    this.cancel.emit();
  }

  onConfirm(): void {
    this.confirm.emit();
  }

  onVisibleChange(value: boolean): void {
    if (!value) {
      this.cancel.emit();
    }
    this.visibleChange.emit(value);
  }
}
