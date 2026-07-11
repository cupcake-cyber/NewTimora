export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'INACTIVE' | 'DELETED';
export type BookingType = 'APPOINTMENT' | 'RESERVATION';

export interface BookingDTO {
  id: number;
  companyId: number;
  serviceId: number;
  customerId: number;
  createdByUserId: number;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  type: BookingType;
  name: string | null;
  description: string | null;
  createdAt: string;
}
