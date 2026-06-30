// ========================
// ENUMS
// ========================

export type ServiceStatus = 'ACTIVE' | 'INACTIVE' | 'TEMPORARILY_UNAVAILABLE' | 'ARCHIVED';

// ========================
// SERVICE
// ========================

export interface ServiceDTO {
  id: number;
  companyId: number;
  companyName: string;
  supplierId: number;
  supplierName: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  status: ServiceStatus;
  createdAt: string;
}

export interface ServiceCreateDTO {
  companyId: number;
  supplierId: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  status?: ServiceStatus;
}

export interface ServicePatchDTO {
  supplierId?: number;
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  status?: ServiceStatus;
}