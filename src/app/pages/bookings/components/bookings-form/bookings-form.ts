import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X,Plus } from 'lucide-angular';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { 
  BookingCreateDTO, 
  BookingType
} from '../../../../models/booking';
import { PersonIdentityDTO } from '../../../../models/person-identity';
import { ServiceDTO } from '../../../../models/service';

@Component({
  selector: 'app-bookings-form',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, DialogModule, ButtonModule],
  templateUrl: './bookings-form.html',
  styleUrls: ['./bookings-form.scss'],
})
export class BookingsForm implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() createData: BookingCreateDTO | null = null;
  @Input() services: ServiceDTO[] = [];
  @Input() customers: PersonIdentityDTO[] = [];
  @Input() loading = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<BookingCreateDTO>();
  @Output() cancel = new EventEmitter<void>();

  icons = { X,Plus };

  // Opciones de tipo
  typeOptions = [
    { value: 'APPOINTMENT', label: 'Cita' },
    { value: 'RESERVATION', label: 'Reserva' }
  ];

  // Formulario
  form: BookingCreateDTO = this.createEmptyForm();

  ngOnInit(): void {
    this.resetForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      this.resetForm();
    }

    if (changes['createData'] && this.createData) {
      this.form = { ...this.createData };
    }
  }

  // ==================== RESET ====================

  resetForm(): void {
    if (this.createData) {
      this.form = { ...this.createData };
    } else {
      this.form = this.createEmptyForm();
    }
  }

  createEmptyForm(): BookingCreateDTO {
    const now = new Date();
    const end = new Date(now.getTime() + 60 * 60 * 1000);

    return {
      companyId: 0,
      serviceId: 0,
      customerId: 0,
      startTime: this.formatDateTimeLocal(now),
      endTime: this.formatDateTimeLocal(end),
      type: 'APPOINTMENT',
      name: '',
      description: ''
    };
  }

  private formatDateTimeLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // ==================== GETTERS ====================

  get modalTitle(): string {
    return 'Nueva reserva';
  }

  get minDateTime(): string {
    const now = new Date();
    return this.formatDateTimeLocal(now);
  }

  // ==================== EVENTOS ====================

  onServiceChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.form.serviceId = Number(select.value);
  }

  onCustomerChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.form.customerId = Number(select.value);
  }

  getPersonName(personIdentity: PersonIdentityDTO): string {
    return `${personIdentity.person.firstName} ${personIdentity.person.lastName}`;
  }

  getServiceName(serviceId: number): string {
    const service = this.services.find(s => s.id === serviceId);
    return service?.name || `Servicio #${serviceId}`;
  }

  // ==================== VALIDACIÓN ====================

  private validateForm(): boolean {
    if (!this.form.serviceId || this.form.serviceId === 0) {
      alert('Por favor selecciona un servicio');
      return false;
    }

    if (!this.form.customerId || this.form.customerId === 0) {
      alert('Por favor selecciona un cliente');
      return false;
    }

    if (!this.form.startTime) {
      alert('Por favor selecciona fecha y hora de inicio');
      return false;
    }

    if (!this.form.endTime) {
      alert('Por favor selecciona fecha y hora de fin');
      return false;
    }

    const start = new Date(this.form.startTime);
    const end = new Date(this.form.endTime);
    const now = new Date();

    if (start < now) {
      alert('La fecha de inicio no puede ser en el pasado');
      return false;
    }

    if (end <= start) {
      alert('La fecha de fin debe ser posterior a la fecha de inicio');
      return false;
    }

    return true;
  }

  onSubmit(): void {
    if (!this.validateForm()) return;

    const createData: BookingCreateDTO = {
      companyId: Number(this.form.companyId || 0),
      serviceId: Number(this.form.serviceId),
      customerId: Number(this.form.customerId),
      startTime: this.form.startTime,
      endTime: this.form.endTime,
      type: this.form.type,
      name: this.form.name || '',
      description: this.form.description || ''
    };

    console.log('📤 Enviando CREATE:', createData);
    this.save.emit(createData);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onVisibleChange(value: boolean): void {
    if (!value) {
      this.cancel.emit();
    }
    this.visibleChange.emit(value);
  }

  trackByService(index: number, service: ServiceDTO): number {
    return service.id;
  }

  trackByCustomer(index: number, customer: PersonIdentityDTO): number {
    return customer.person.id;
  }
}