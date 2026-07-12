import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Pencil, Trash2, Clock } from 'lucide-angular';
import { ServiceDTO } from '../../../../models/service';
import { PersonIdentityDTO } from '../../../../models/person-identity';

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './services-list.html',
  styleUrls: ['./services-list.scss'],
})
export class ServicesList {
  @Input() services: ServiceDTO[] = [];
  @Input() allSuppliers: PersonIdentityDTO[] = [];
  @Input() loading = false;

  @Output() edit = new EventEmitter<ServiceDTO>();
  @Output() delete = new EventEmitter<ServiceDTO>();

  icons = { Pencil, Trash2, Clock };

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'ACTIVE': 'bg-emerald-500/10 text-emerald-400',
      'INACTIVE': 'bg-red-500/10 text-red-400',
      'TEMPORARILY_UNAVAILABLE': 'bg-amber-500/10 text-amber-400',
      'ARCHIVED': 'bg-gray-500/10 text-gray-400'
    };
    return classes[status] || classes['ACTIVE'];
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'ACTIVE': 'Active',
      'INACTIVE': 'Inactive',
      'TEMPORARILY_UNAVAILABLE': 'Unavailable',
      'ARCHIVED': 'Archived'
    };
    return labels[status] || status;
  }

  getUniqueSuppliers(): { id: number, name: string, specialty?: string }[] {
    const supplierMap = new Map<number, { id: number, name: string, specialty?: string }>();
    for (const service of this.services) {
      if (!supplierMap.has(service.supplierId)) {
        const supplier = this.allSuppliers.find(s => s.supplier?.id === service.supplierId);
        supplierMap.set(service.supplierId, {
          id: service.supplierId,
          name: service.supplierName,
          specialty: supplier?.supplier?.specialty || 'Supplier'
        });
      }
    }
    return Array.from(supplierMap.values());
  }

  getServicesBySupplier(supplierId: number): ServiceDTO[] {
    return this.services.filter(s => s.supplierId === supplierId);
  }
}
