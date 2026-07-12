// models/booking.ts

// ==================== ENUMS ====================

export type BookingStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'INACTIVE' 
  | 'DELETED';

export type BookingType = 
  | 'APPOINTMENT' 
  | 'RESERVATION';

// ==================== DTOs ====================

/**
 * DTO para crear un booking
 */
export interface BookingCreateDTO {
  companyId: number;
  serviceId: number;
  customerId: number;
  startTime: string; // LocalDateTime (YYYY-MM-DDTHH:MM:SS)
  endTime: string;   // LocalDateTime (YYYY-MM-DDTHH:MM:SS)
  type?: BookingType;
  name?: string;
  description?: string;
}

/**
 * DTO para respuesta del booking (GET)
 */
export interface BookingDTO {
  id: number;
  companyId: number;
  serviceId: number;
  customerId: number;
  createdByUserId: number;
  startTime: string; // LocalDateTime (YYYY-MM-DDTHH:MM:SS)
  endTime: string;   // LocalDateTime (YYYY-MM-DDTHH:MM:SS)
  status: BookingStatus;
  type: BookingType;
  name?: string;
  description?: string;
  createdAt: string; // LocalDateTime (YYYY-MM-DDTHH:MM:SS)
}

/**
 * DTO para actualizar un booking (PATCH)
 */
export interface BookingPatchDTO {
  serviceId?: number;
  customerId?: number;
  startTime?: string;
  endTime?: string;
  status?: BookingStatus;
  type?: BookingType;
  name?: string;
  description?: string;
}

// ==================== EXTENDED MODELS (para Frontend) ====================

/**
 * Booking extendido con datos adicionales para mostrar en UI
 */
export interface BookingViewModel extends BookingDTO {
  serviceName?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  supplierName?: string;
  supplierId?: number;
  durationMinutes?: number;
  isPast?: boolean;
  isToday?: boolean;
  isFuture?: boolean;
}

/**
 * Booking para mostrar en calendario
 */
export interface BookingEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  booking: BookingDTO;
  customerName?: string;
  serviceName?: string;
}

// ==================== FILTERS ====================

export interface BookingFilter {
  supplierId?: number;
  customerId?: number;
  serviceId?: number;
  startDate?: Date;
  endDate?: Date;
  status?: BookingStatus[];
  type?: BookingType[];
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Obtiene el color según el estado del booking
 */
export function getBookingStatusColor(status: BookingStatus): string {
  const colorMap: Record<BookingStatus, string> = {
    'PENDING': '#F59E0B',    // Yellow/Amber
    'CONFIRMED': '#3B82F6',  // Blue
    'COMPLETED': '#10B981',  // Green
    'CANCELLED': '#EF4444',  // Red
    'INACTIVE': '#6B7280',   // Gray
    'DELETED': '#6B7280'     // Gray
  };
  return colorMap[status] || '#6B7280';
}

/**
 * Obtiene el label legible para el estado
 */
export function getBookingStatusLabel(status: BookingStatus): string {
  const labelMap: Record<BookingStatus, string> = {
    'PENDING': 'Pendiente',
    'CONFIRMED': 'Confirmado',
    'COMPLETED': 'Completado',
    'CANCELLED': 'Cancelado',
    'INACTIVE': 'Inactivo',
    'DELETED': 'Eliminado'
  };
  return labelMap[status] || status;
}

/**
 * Obtiene el color según el tipo de booking
 */
export function getBookingTypeColor(type: BookingType): string {
  const colorMap: Record<BookingType, string> = {
    'APPOINTMENT': '#8B5CF6',  // Purple
    'RESERVATION': '#EC4899'   // Pink
  };
  return colorMap[type] || '#6B7280';
}

/**
 * Obtiene el label legible para el tipo
 */
export function getBookingTypeLabel(type: BookingType): string {
  const labelMap: Record<BookingType, string> = {
    'APPOINTMENT': 'Cita',
    'RESERVATION': 'Reserva'
  };
  return labelMap[type] || type;
}

/**
 * Calcula la duración en minutos
 */
export function getBookingDuration(startTime: string, endTime: string): number {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
}

/**
 * Formatea la fecha para mostrar
 */
export function formatBookingDateTime(dateTime: string): string {
  const date = new Date(dateTime);
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Formatea solo la fecha
 */
export function formatBookingDate(dateTime: string): string {
  const date = new Date(dateTime);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Formatea solo la hora
 */
export function formatBookingTime(dateTime: string): string {
  const date = new Date(dateTime);
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Verifica si un booking es en el pasado
 */
export function isBookingPast(booking: BookingDTO): boolean {
  return new Date(booking.endTime) < new Date();
}

/**
 * Verifica si un booking es hoy
 */
export function isBookingToday(booking: BookingDTO): boolean {
  const today = new Date();
  const bookingDate = new Date(booking.startTime);
  return today.getDate() === bookingDate.getDate() &&
         today.getMonth() === bookingDate.getMonth() &&
         today.getFullYear() === bookingDate.getFullYear();
}

/**
 * Verifica si un booking es en el futuro
 */
export function isBookingFuture(booking: BookingDTO): boolean {
  return new Date(booking.startTime) > new Date();
}

/**
 * Convierte BookingDTO a BookingViewModel con datos extendidos
 */
export function toBookingViewModel(
  booking: BookingDTO,
  options?: {
    serviceName?: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    supplierName?: string;
    supplierId?: number;
  }
): BookingViewModel {
  return {
    ...booking,
    serviceName: options?.serviceName,
    customerName: options?.customerName,
    customerEmail: options?.customerEmail,
    customerPhone: options?.customerPhone,
    supplierName: options?.supplierName,
    supplierId: options?.supplierId,
    durationMinutes: getBookingDuration(booking.startTime, booking.endTime),
    isPast: isBookingPast(booking),
    isToday: isBookingToday(booking),
    isFuture: isBookingFuture(booking)
  };
}

/**
 * Convierte BookingDTO a BookingEvent para calendario
 */
export function toBookingEvent(
  booking: BookingDTO,
  options?: {
    customerName?: string;
    serviceName?: string;
    color?: string;
  }
): BookingEvent {
  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);
  
  const customer = options?.customerName || `Cliente ${booking.customerId}`;
  const service = options?.serviceName || `Servicio ${booking.serviceId}`;
  
  return {
    id: booking.id,
    title: `${customer} - ${service}`,
    start,
    end,
    color: options?.color || getBookingStatusColor(booking.status),
    booking,
    customerName: options?.customerName,
    serviceName: options?.serviceName
  };
}

/**
 * Agrupa bookings por fecha
 */
export function groupBookingsByDate(bookings: BookingDTO[]): Map<string, BookingDTO[]> {
  const grouped = new Map<string, BookingDTO[]>();
  
  bookings.forEach(booking => {
    const dateKey = new Date(booking.startTime).toDateString();
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(booking);
  });
  
  return grouped;
}

/**
 * Filtra bookings según criterios
 */
export function filterBookings(
  bookings: BookingDTO[],
  filter: BookingFilter
): BookingDTO[] {
  return bookings.filter(booking => {
    // Filtrar por supplier
    if (filter.supplierId) {
      // Nota: BookingDTO no tiene supplierId directamente
      // Se necesita obtener del service
      // Esto es un placeholder, se debe implementar con los datos disponibles
    }
    
    // Filtrar por customer
    if (filter.customerId && booking.customerId !== filter.customerId) {
      return false;
    }
    
    // Filtrar por service
    if (filter.serviceId && booking.serviceId !== filter.serviceId) {
      return false;
    }
    
    // Filtrar por fecha
    if (filter.startDate) {
      const bookingDate = new Date(booking.startTime);
      if (bookingDate < filter.startDate) {
        return false;
      }
    }
    
    if (filter.endDate) {
      const bookingDate = new Date(booking.startTime);
      if (bookingDate > filter.endDate) {
        return false;
      }
    }
    
    // Filtrar por status
    if (filter.status && filter.status.length > 0) {
      if (!filter.status.includes(booking.status)) {
        return false;
      }
    }
    
    // Filtrar por type
    if (filter.type && filter.type.length > 0) {
      if (!filter.type.includes(booking.type)) {
        return false;
      }
    }
    
    return true;
  });
}

/**
 * Ordena bookings por fecha (ascendente)
 */
export function sortBookingsByDate(bookings: BookingDTO[]): BookingDTO[] {
  return [...bookings].sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );
}

/**
 * Ordena bookings por fecha (descendente)
 */
export function sortBookingsByDateDesc(bookings: BookingDTO[]): BookingDTO[] {
  return [...bookings].sort((a, b) => 
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );
}

/**
 * Obtiene los bookings de hoy
 */
export function getTodayBookings(bookings: BookingDTO[]): BookingDTO[] {
  const today = new Date().toDateString();
  return bookings.filter(booking => 
    new Date(booking.startTime).toDateString() === today
  );
}

/**
 * Obtiene los bookings de esta semana
 */
export function getThisWeekBookings(bookings: BookingDTO[]): BookingDTO[] {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  
  return bookings.filter(booking => {
    const bookingDate = new Date(booking.startTime);
    return bookingDate >= startOfWeek && bookingDate < endOfWeek;
  });
}

/**
 * Obtiene los bookings del mes actual
 */
export function getCurrentMonthBookings(bookings: BookingDTO[]): BookingDTO[] {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  
  return bookings.filter(booking => {
    const bookingDate = new Date(booking.startTime);
    return bookingDate >= startOfMonth && bookingDate < endOfMonth;
  });
}