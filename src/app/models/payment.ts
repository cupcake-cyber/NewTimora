export type PaymentStatus = 'PENDING' | 'PAID' | 'PARTIALLY_PAID' | 'FAILED' | 'REFUNDED' | 'CANCELLED' | 'DELETED';
export type PaymentMethod = 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'YAPE' | 'PLIN' | 'DIGITAL_WALLET' | 'OTHER';

export interface PaymentDTO {
  id: number;
  companyId: number;
  bookingId: number;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  createdAt: string;
}
