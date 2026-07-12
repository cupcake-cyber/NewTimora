import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X, Plus, Pen, Trash2, CircleCheckBig, Pencil, Save } from 'lucide-angular';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { BookingDTO, BookingStatus, BookingType, BookingPatchDTO } from '../../../../models/booking';
import { PaymentDTO, PaymentCreateDTO, PaymentPatchDTO, PaymentMethod, PaymentStatus } from '../../../../models/payments';
import { PersonIdentityDTO } from '../../../../models/person-identity';
import { ServiceDTO } from '../../../../models/service';
import { 
  getPaymentStatusColor, 
  getPaymentStatusLabel, 
  getPaymentMethodLabel,
  formatPaymentAmount,
  isPaymentEditable
} from '../../../../models/payments';

interface PaymentForm {
  companyId?: number;
  bookingId?: number;
  amount: number;
  method: PaymentMethod;
  status?: PaymentStatus;
}

@Component({
  selector: 'app-booking-detail-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, DialogModule, ButtonModule],
  templateUrl: './booking-detail-modal.html',
  styleUrls: ['./booking-detail-modal.scss'],
})
export class BookingDetailModal implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() booking: BookingDTO | null = null;
  @Input() payment: PaymentDTO | null = null;
  @Input() customers: PersonIdentityDTO[] = [];
  @Input() services: ServiceDTO[] = [];
  @Input() loading = false;
  @Input() loadingPayment = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() close = new EventEmitter<void>();
  @Output() updateBookingStatus = new EventEmitter<{ id: number; status: BookingStatus }>();
  @Output() updateBookingFull = new EventEmitter<{ id: number; data: BookingPatchDTO }>();
  @Output() deleteBooking = new EventEmitter<number>();
  @Output() savePayment = new EventEmitter<PaymentCreateDTO>();
  @Output() updatePayment = new EventEmitter<{ id: number; data: PaymentPatchDTO }>();
  @Output() deletePayment = new EventEmitter<number>();

  icons = { X, Plus, Pen, Trash2, CircleCheckBig, Pencil, Save };

  isEditingBooking = false;
  editBookingData: BookingPatchDTO = {};

  showPaymentForm = false;
  isEditingPayment = false;
  paymentForm: PaymentForm = this.createEmptyPaymentForm();

  paymentMethods: { value: PaymentMethod; label: string }[] = [
    { value: 'CASH', label: 'Efectivo' },
    { value: 'CREDIT_CARD', label: 'Tarjeta Crédito' },
    { value: 'DEBIT_CARD', label: 'Tarjeta Débito' },
    { value: 'BANK_TRANSFER', label: 'Transferencia' },
    { value: 'YAPE', label: 'Yape' },
    { value: 'PLIN', label: 'Plin' },
    { value: 'DIGITAL_WALLET', label: 'Billetera Digital' },
    { value: 'OTHER', label: 'Otro' }
  ];

  paymentStatuses: { value: PaymentStatus; label: string }[] = [
    { value: 'PENDING', label: 'Pendiente' },
    { value: 'PAID', label: 'Pagado' },
    { value: 'PARTIALLY_PAID', label: 'Parcial' },
    { value: 'FAILED', label: 'Fallido' },
    { value: 'REFUNDED', label: 'Reembolsado' },
    { value: 'CANCELLED', label: 'Cancelado' }
  ];

  typeOptions: { value: BookingType; label: string }[] = [
    { value: 'APPOINTMENT', label: 'Cita' },
    { value: 'RESERVATION', label: 'Reserva' }
  ];

  ngOnInit(): void {
    this.resetPaymentForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && !this.visible) {
      this.resetPaymentForm();
      this.showPaymentForm = false;
      this.isEditingBooking = false;
    }
    if (changes['payment'] && this.payment) {
      this.showPaymentForm = false;
      this.isEditingPayment = false;
    }
    if (changes['booking'] && this.booking) {
      // 🔴 Cuando el booking cambia (ej: después de guardar), salimos del modo edición y recargamos los datos
      this.isEditingBooking = false;
      this.initEditBookingData();
    }
  }

  // ==================== INICIALIZAR DATOS DE EDICIÓN ====================

  private initEditBookingData(): void {
    if (!this.booking) return;
    this.editBookingData = {
      serviceId: this.booking.serviceId,
      customerId: this.booking.customerId,
      startTime: this.booking.startTime,
      endTime: this.booking.endTime,
      type: this.booking.type,
      name: this.booking.name,
      description: this.booking.description
    };
  }

  // ==================== GETTERS (sin cambios) ====================

  get modalTitle(): string {
    return `Detalle de cita #${this.booking?.id || ''}`;
  }

  get customerName(): string {
    const booking = this.booking;
    if (!booking) return '—';
    const customer = this.customers.find(c => c.customer?.id === booking.customerId);
    return customer ? `${customer.person.firstName} ${customer.person.lastName}` : `Cliente #${booking.customerId}`;
  }

  get customerEmail(): string {
    const booking = this.booking;
    if (!booking) return '';
    const customer = this.customers.find(c => c.customer?.id === booking.customerId);
    return customer?.person.email || '';
  }

  get customerPhone(): string {
    const booking = this.booking;
    if (!booking) return '';
    const customer = this.customers.find(c => c.customer?.id === booking.customerId);
    return customer?.person.phone || '';
  }

  get serviceName(): string {
    const booking = this.booking;
    if (!booking) return '—';
    const service = this.services.find(s => s.id === booking.serviceId);
    return service?.name || `Servicio #${booking.serviceId}`;
  }

  get serviceDuration(): string {
    const booking = this.booking;
    if (!booking) return '';
    const service = this.services.find(s => s.id === booking.serviceId);
    return service?.duration ? `${service.duration} min` : '';
  }

  get servicePrice(): string {
    const booking = this.booking;
    if (!booking) return '';
    const service = this.services.find(s => s.id === booking.serviceId);
    return service?.price ? `S/. ${service.price.toFixed(2)}` : '';
  }

  get statusLabel(): string {
    const map: Record<string, string> = {
      'PENDING': 'Pendiente',
      'CONFIRMED': 'Confirmada',
      'COMPLETED': 'Completada',
      'CANCELLED': 'Cancelada',
      'INACTIVE': 'Inactiva',
      'DELETED': 'Eliminada'
    };
    return this.booking ? map[this.booking.status] || this.booking.status : '';
  }

  get statusColor(): string {
    const map: Record<string, string> = {
      'PENDING': 'bg-yellow-500/10 text-yellow-400',
      'CONFIRMED': 'bg-emerald-500/10 text-emerald-400',
      'COMPLETED': 'bg-blue-500/10 text-blue-400',
      'CANCELLED': 'bg-red-500/10 text-red-400',
      'INACTIVE': 'bg-gray-500/10 text-gray-400',
      'DELETED': 'bg-gray-500/10 text-gray-400'
    };
    return this.booking ? map[this.booking.status] || 'bg-gray-500/10 text-gray-400' : '';
  }

  get hasPayment(): boolean {
    return !!this.payment && this.payment.status !== 'DELETED';
  }

  get isBookingCompleted(): boolean {
    return this.booking?.status === 'COMPLETED';
  }

  get isBookingCancelled(): boolean {
    return this.booking?.status === 'CANCELLED' || this.booking?.status === 'DELETED';
  }

  get canEditBooking(): boolean {
    return !this.isBookingCompleted && !this.isBookingCancelled;
  }

  get canEditPayment(): boolean {
    return this.hasPayment && !this.isBookingCompleted && !this.isBookingCancelled && isPaymentEditable(this.payment!);
  }

  get canAddPayment(): boolean {
    return !this.hasPayment && !this.isBookingCompleted && !this.isBookingCancelled;
  }

  get canCompleteBooking(): boolean {
    return this.booking?.status === 'CONFIRMED' && this.hasPayment && this.payment?.status === 'PAID';
  }

  get canCancelBooking(): boolean {
    return !this.isBookingCompleted && !this.isBookingCancelled;
  }

  get canDeleteBooking(): boolean {
    return !this.isBookingCancelled;
  }

  // ==================== FORMATOS (sin cambios) ====================

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getPaymentMethodLabel(method: PaymentMethod): string {
    return getPaymentMethodLabel(method);
  }

  getPaymentStatusLabel(status: PaymentStatus): string {
    return getPaymentStatusLabel(status);
  }

  getPaymentStatusColor(status: PaymentStatus): string {
    return getPaymentStatusColor(status);
  }

  formatAmount(amount: number): string {
    return formatPaymentAmount(amount);
  }

  // ==================== FORMULARIO DE PAGO (sin cambios) ====================

  createEmptyPaymentForm(): PaymentForm {
    return {
      companyId: this.booking?.companyId || 0,
      bookingId: this.booking?.id || 0,
      amount: 0,
      method: 'CASH',
      status: 'PENDING'
    };
  }

  resetPaymentForm(): void {
    this.paymentForm = this.createEmptyPaymentForm();
    this.isEditingPayment = false;
  }

  openPaymentForm(): void {
    this.showPaymentForm = true;
    this.isEditingPayment = false;
    this.paymentForm = {
      companyId: this.booking?.companyId || 0,
      bookingId: this.booking?.id || 0,
      amount: 0,
      method: 'CASH'
    };
  }

  openEditPaymentForm(): void {
    if (!this.payment) return;
    this.showPaymentForm = true;
    this.isEditingPayment = true;
    this.paymentForm = {
      amount: this.payment.amount,
      status: this.payment.status,
      method: this.payment.method
    };
  }

  closePaymentForm(): void {
    this.showPaymentForm = false;
    this.isEditingPayment = false;
    this.resetPaymentForm();
  }

  onSavePayment(): void {
    if (this.isEditingPayment && this.payment) {
      const patchData: PaymentPatchDTO = {
        amount: this.paymentForm.amount,
        status: this.paymentForm.status!,
        method: this.paymentForm.method
      };
      this.updatePayment.emit({ id: this.payment.id, data: patchData });
    } else {
      const createData: PaymentCreateDTO = {
        companyId: this.booking?.companyId || 0,
        bookingId: this.booking?.id || 0,
        amount: this.paymentForm.amount || 0,
        method: this.paymentForm.method
      };
      this.savePayment.emit(createData);
    }
    this.closePaymentForm();
  }

  // ==================== EDICIÓN DEL BOOKING (sin cambios) ====================

  toggleEditBooking(): void {
    if (this.isEditingBooking) {
      this.isEditingBooking = false;
      this.initEditBookingData();
    } else {
      this.isEditingBooking = true;
    }
  }

  onSaveBookingEdit(): void {
    if (!this.booking) return;
    this.updateBookingFull.emit({
      id: this.booking.id,
      data: this.editBookingData
    });
  }

  // ==================== ACCIONES (sin cambios) ====================

  onCompleteBooking(): void {
    if (!this.booking) return;
    if (confirm('¿Marcar esta cita como completada?')) {
      this.updateBookingStatus.emit({ id: this.booking.id, status: 'COMPLETED' });
    }
  }

  onCancelBooking(): void {
    if (!this.booking) return;
    if (confirm('¿Cancelar esta cita?')) {
      this.updateBookingStatus.emit({ id: this.booking.id, status: 'CANCELLED' });
    }
  }

  onDeleteBooking(): void {
    if (!this.booking) return;
    if (confirm('¿Eliminar esta cita? Esta acción no se puede deshacer.')) {
      this.deleteBooking.emit(this.booking.id);
    }
  }

  onDeletePayment(): void {
    if (!this.payment) return;
    if (confirm('¿Eliminar este pago?')) {
      this.deletePayment.emit(this.payment.id);
    }
  }

  // ==================== CERRAR MODAL ====================

  onClose(): void {
    this.close.emit();
    this.visibleChange.emit(false);
  }

  onVisibleChange(value: boolean): void {
    if (!value) {
      this.onClose();
    }
    this.visibleChange.emit(value);
  }

  // ==================== HELPERS PARA SELECTS ====================

  getPersonName(personIdentity: PersonIdentityDTO): string {
    return `${personIdentity.person.firstName} ${personIdentity.person.lastName}`;
  }

  getServiceNameForSelect(service: ServiceDTO): string {
    return service.name;
  }
}