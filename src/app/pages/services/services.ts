import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicesService } from '../../services/service/service';
import { CompaniesService } from '../../services/companies/companies';
import { PersonService } from '../../services/person-identity/person-identity';
import { AuthService } from '../../services/auth/auth';
import { ServiceDTO, ServiceCreateDTO, ServicePatchDTO } from '../../models/service';
import { CompanyDTO } from '../../models/company';
import { PersonIdentityDTO } from '../../models/person-identity';
import { CurrentUser } from '../../models/currentUser';
import { ServicesFilter } from './components/services-filter/services-filter';
import { ServicesList } from './components/services-list/services-list';
import { ServicesForm } from './components/services-form/services-form';
import { ServicesDeleteModal } from './components/services-delete-modal/services-delete-modal';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule, ServicesFilter, ServicesList, ServicesForm, ServicesDeleteModal],
  templateUrl: './services.html',
  styleUrl: './services.scss'
})
export class ServicesComponent implements OnInit {

  currentUser: CurrentUser | null = null;
  currentUserSupplier: PersonIdentityDTO | null = null;
  allServices: ServiceDTO[] = [];
  services: ServiceDTO[] = [];
  companies: CompanyDTO[] = [];
  allSuppliers: PersonIdentityDTO[] = [];
  filteredSuppliers: PersonIdentityDTO[] = [];

  selectedCompanyId: number | null = null;
  selectedSupplierId: number | null = null;
  loading = false;
  ready = false;

  showModal = false;
  modalMode: 'create' | 'edit' = 'create';
  editData: ServiceDTO | null = null;

  showDeleteModal = false;
  serviceToDelete: ServiceDTO | null = null;

  private servicesService = inject(ServicesService);
  private companiesService = inject(CompaniesService);
  private personService = inject(PersonService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  get isOwner() { return this.currentUser?.role === 'OWNER'; }
  get isAdmin() { return this.currentUser?.role === 'ADMIN'; }
  get isUser() { return this.currentUser?.role === 'USER'; }
  get canSelectCompany() { return this.isOwner; }
  get canSelectSupplier() { return this.isOwner || this.isAdmin; }

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    this.loadData();
  }

  private loadData(): void {
    if (this.isOwner) this.loadCompanies();
    this.loadSuppliers();
    this.loadCurrentUserSupplier();
    this.loadServices();
  }

  private loadCompanies(): void {
    this.companiesService.getAll().subscribe({
      next: d => { this.companies = d ?? []; this.cdr.detectChanges(); },
      error: console.error
    });
  }

  private loadSuppliers(): void {
    this.personService.getAll().subscribe({
      next: d => {
        let suppliers = (d ?? []).filter(x => x.supplier !== null && x.supplier !== undefined);
        if (this.isUser && this.currentUser) {
          suppliers = suppliers.filter(s => s.person.id === this.currentUser?.personId);
        }
        if (this.isAdmin && this.currentUser) {
          suppliers = suppliers.filter(s => s.person.companyId === this.currentUser?.companyId);
        }
        this.allSuppliers = suppliers;
        this.filterSuppliersByCompany();
        this.cdr.detectChanges();
      },
      error: console.error
    });
  }

  private loadCurrentUserSupplier(): void {
    if (!this.currentUser) return;
    this.personService.getById(this.currentUser.personId).subscribe({
      next: (person) => {
        if (person.supplier) {
          this.currentUserSupplier = person;
        }
        this.cdr.detectChanges();
      },
      error: console.error
    });
  }

  private loadServices(): void {
    this.loading = true;
    this.servicesService.getAll().subscribe({
      next: (d) => {
        this.allServices = d ?? [];
        this.loading = false;
        this.ready = true;
        this.applyFilter();
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error(e);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterSuppliersByCompany(): void {
    if (this.isOwner && this.selectedCompanyId !== null) {
      this.filteredSuppliers = this.allSuppliers.filter(s => s.person.companyId === this.selectedCompanyId);
    } else {
      this.filteredSuppliers = this.allSuppliers;
    }
    if (this.selectedSupplierId !== null) {
      const stillExists = this.filteredSuppliers.some(s => s.supplier?.id === this.selectedSupplierId);
      if (!stillExists) {
        this.selectedSupplierId = null;
      }
    }
    this.cdr.detectChanges();
  }

  applyFilter(): void {
    let r = [...this.allServices];
    if (this.isOwner && this.selectedCompanyId !== null) {
      r = r.filter(x => x.companyId === this.selectedCompanyId);
    }
    if ((this.isOwner || this.isAdmin) && this.selectedSupplierId !== null) {
      r = r.filter(x => x.supplierId === this.selectedSupplierId);
    }
    this.services = r;
  }

  onCompanyChange(companyId: number | null): void {
    this.selectedCompanyId = companyId;
    this.selectedSupplierId = null;
    this.filterSuppliersByCompany();
    this.applyFilter();
    this.cdr.detectChanges();
  }

  onSupplierChange(supplierId: number | null): void {
    this.selectedSupplierId = supplierId;
    this.applyFilter();
    this.cdr.detectChanges();
  }

  onSearchChange(term: string): void {
    const t = term.trim().toLowerCase();
    if (!t) {
      this.applyFilter();
      return;
    }
    this.services = this.allServices.filter(x =>
      x.name.toLowerCase().includes(t) ||
      x.description.toLowerCase().includes(t) ||
      x.supplierName.toLowerCase().includes(t)
    );
  }

  // ==================== MODAL CREACIÓN ====================
  onAddClick(): void {
    this.modalMode = 'create';
    this.editData = null;
    this.showModal = true;
  }

  // ==================== MODAL EDICIÓN ====================
  onEdit(service: ServiceDTO): void {
    this.modalMode = 'edit';
    this.editData = service;
    this.showModal = true;
  }

  // ==================== MODAL ELIMINACIÓN ====================
  onDelete(service: ServiceDTO): void {
    this.serviceToDelete = service;
    this.showDeleteModal = true;
  }

  // ==================== CERRAR MODALES ====================
  closeModal(): void {
    this.showModal = false;
    this.editData = null;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.serviceToDelete = null;
  }

  // ==================== GUARDAR ====================
  onSave(data: ServiceCreateDTO | ServicePatchDTO): void {
    if (this.modalMode === 'edit' && this.editData) {
      this.servicesService.patch(this.editData.id, data as ServicePatchDTO).subscribe({
        next: () => {
          this.showModal = false;
          this.editData = null;
          this.loadServices();
        },
        error: console.error
      });
    } else {
      this.servicesService.create(data as ServiceCreateDTO).subscribe({
        next: () => {
          this.showModal = false;
          this.loadServices();
        },
        error: console.error
      });
    }
  }

  // ==================== CONFIRMAR ELIMINACIÓN ====================
  confirmDelete(): void {
    if (!this.serviceToDelete) return;
    this.servicesService.delete(this.serviceToDelete.id).subscribe({
      next: () => {
        this.showDeleteModal = false;
        this.serviceToDelete = null;
        this.loadServices();
      },
      error: console.error
    });
  }
}
