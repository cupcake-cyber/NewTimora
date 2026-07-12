import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X } from 'lucide-angular';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ServiceDTO, ServiceCreateDTO, ServicePatchDTO, ServiceStatus } from '../../../../models/service';
import { CompanyDTO } from '../../../../models/company';
import { PersonIdentityDTO } from '../../../../models/person-identity';

interface ServiceForm {
  companyId: number | null;
  supplierId: number | null;
  name: string;
  description: string;
  price: number | null;
  duration: number | null;
  status: ServiceStatus;
}

@Component({
  selector: 'app-services-form',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, DialogModule, ButtonModule],
  templateUrl: './services-form.html',
  styleUrls: ['./services-form.scss'],
})
export class ServicesForm implements OnChanges {
  @Input() visible = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() editData: ServiceDTO | null = null;
  @Input() companies: CompanyDTO[] = [];
  @Input() suppliers: PersonIdentityDTO[] = [];
  @Input() loading = false;
  @Input() isOwner = false;
  @Input() isUser = false;
  @Input() defaultCompanyId: number | null = null;
  @Input() defaultSupplierId: number | null = null;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<ServiceCreateDTO | ServicePatchDTO>();
  @Output() cancel = new EventEmitter<void>();

  icons = { X };

  form: ServiceForm = this.createEmptyForm();
  modalSuppliers: PersonIdentityDTO[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      this.resetForm();
    }
    if (changes['editData'] && this.editData && this.mode === 'edit') {
      this.loadEditData();
    }
    if (changes['suppliers']) {
      this.updateModalSuppliers();
    }
  }

  get modalTitle(): string {
    return this.mode === 'edit' ? 'Edit Service' : 'New Service';
  }

  get submitLabel(): string {
    return this.mode === 'edit' ? 'Save Changes' : 'Create Service';
  }

  private createEmptyForm(): ServiceForm {
    return {
      companyId: this.defaultCompanyId ?? null,
      supplierId: this.defaultSupplierId ?? null,
      name: '',
      description: '',
      price: null,
      duration: null,
      status: 'ACTIVE'
    };
  }

  private loadEditData(): void {
    if (!this.editData) return;
    this.form = {
      companyId: null,
      supplierId: null,
      name: this.editData.name,
      description: this.editData.description,
      price: this.editData.price,
      duration: this.editData.duration,
      status: this.editData.status
    };
  }

  private resetForm(): void {
    if (this.mode === 'edit' && this.editData) {
      this.loadEditData();
    } else {
      this.form = this.createEmptyForm();
      if (this.defaultCompanyId) this.form.companyId = this.defaultCompanyId;
      if (this.defaultSupplierId) this.form.supplierId = this.defaultSupplierId;
    }
    this.updateModalSuppliers();
  }

  onCompanyChange(): void {
    this.form.supplierId = null;
    this.updateModalSuppliers();
  }

  private updateModalSuppliers(): void {
    const companyId = this.form.companyId;
    let list = this.suppliers.filter(s => s.supplier !== null && s.supplier !== undefined);
    if (companyId !== null) {
      list = list.filter(s => Number(s.person.companyId) === Number(companyId));
    }
    this.modalSuppliers = list;
  }

  getSupplierName(supplier: PersonIdentityDTO): string {
    return `${supplier.person.firstName} ${supplier.person.lastName}`;
  }

  trackBySupplier(index: number, item: PersonIdentityDTO): number {
    return item.supplier?.id ?? index;
  }

  onSubmit(): void {
    if (this.mode === 'edit') {
      const payload: ServicePatchDTO = {
        name: this.form.name,
        description: this.form.description,
        price: this.form.price ?? undefined,
        duration: this.form.duration ?? undefined,
        status: this.form.status
      };
      this.save.emit(payload);
    } else {
      const payload: ServiceCreateDTO = {
        companyId: Number(this.form.companyId),
        supplierId: Number(this.form.supplierId),
        name: this.form.name,
        description: this.form.description || '',
        price: Number(this.form.price),
        duration: Number(this.form.duration),
        status: this.form.status || 'ACTIVE'
      };
      this.save.emit(payload);
    }
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
}
