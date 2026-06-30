import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonService } from '../../services/person-identity/person-identity';
import { CompaniesService } from '../../services/companies/companies';
import { AuthService } from '../../services/auth/auth';
import { PersonIdentityDTO } from '../../models/person-identity';
import { CompanyDTO } from '../../models/company';
import { CurrentUser } from '../../models/currentUser';
import { LucideAngularModule, Search, Plus, Pencil, Trash2, Shield, X } from 'lucide-angular';
import { ModalComponent } from '../../components/modal/modal/modal';

type Role = 'OWNER' | 'ADMIN' | 'USER';
type AccountType = 'USER' | 'STAFF' | 'USER_STAFF';

interface UserForm {
  accountType: AccountType;
  companyId: number | null;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  address: string;
  specialty: string;
  notes: string;
  role: Role;
}

interface EditUserForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  role: Role | null;
  supplier: {
    specialty: string;
    notes: string;
  } | null;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, ModalComponent],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class UsersComponent implements OnInit {
  
  isEditMode = false;
  editModalOpen = false;
  editUserId: number | null = null;

  // Para el modal de confirmación de eliminación
  deleteModalOpen = false;
  userToDelete: PersonIdentityDTO | null = null;

  userForm: UserForm = this.createEmptyForm();
  editForm: EditUserForm = this.createEmptyEditForm();

  ready = false;
  loading = false;
  currentUser: CurrentUser | null = null;
  allUsers: PersonIdentityDTO[] = [];
  users: PersonIdentityDTO[] = [];
  companies: CompanyDTO[] = [];
  searchTerm = '';
  selectedCompanyId: number | null = null;
  modalOpen = false;

  icons = { Search, Plus, Pencil, Trash2, Shield, X };
  availableRoles: Role[] = [];
  
  private personService = inject(PersonService);
  private companiesService = inject(CompaniesService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  get isOwner() { return this.currentUser?.role === 'OWNER' }
  get canSelectCompany() { return this.isOwner }

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    this.initContext();
    this.loadData();
  }

  getRole(u: PersonIdentityDTO) {
    return u.user?.role ?? 'STAFF';
  }

  private initContext() {
    this.setAvailableRoles();
    this.setCompanyContext();
  }

  private loadData() {
    if (this.isOwner) this.loadCompanies();
    this.loadUsers();
  }

  private setAvailableRoles() {
    const r = this.currentUser?.role;
    this.availableRoles = {
      OWNER: ['OWNER', 'ADMIN', 'USER'],
      ADMIN: ['ADMIN', 'USER'],
      USER: ['USER']
    }[r ?? 'USER'] as Role[];
  }

  private setCompanyContext() {
    const u = this.currentUser;
    if (u?.role === 'ADMIN') this.selectedCompanyId = u.companyId ?? null;
    if (u?.role === 'OWNER') this.selectedCompanyId = null;
  }

  private loadCompanies() {
    this.companiesService.getAll().subscribe({
      next: d => { this.companies = d ?? []; this.cdr.detectChanges() },
      error: console.error
    });
  }

  private loadUsers() {
    this.loading = true;
    this.personService.getAll().subscribe({
      next: d => {
        // 🔴 FILTRO: Solo los que tienen user (excluye customers)
        this.allUsers = (d ?? []).filter(x => x.user !== null && x.user !== undefined);
        this.loading = false;
        this.ready = true;
        this.applyFilter();
        this.cdr.detectChanges();
      },
      error: e => {
        console.error(e);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter() {
    const u = this.currentUser;
    let r = [...this.allUsers];

    if (u?.role === 'ADMIN' && u.companyId)
      r = r.filter(x => x.person.companyId === u.companyId);

    if (u?.role === 'OWNER' && this.selectedCompanyId !== null)
      r = r.filter(x => x.person.companyId === this.selectedCompanyId);

    const t = this.searchTerm.trim().toLowerCase();

    if (t)
      r = r.filter(x =>
        (x.person.firstName ?? '').toLowerCase().includes(t) ||
        (x.person.lastName ?? '').toLowerCase().includes(t) ||
        (x.user?.email ?? '').toLowerCase().includes(t) ||
        (x.person.phone ?? '').toLowerCase().includes(t)
      );

    this.users = r;
  }

  onCompanyChange() { this.applyFilter(); this.cdr.detectChanges() }
  onSearchChange() { this.applyFilter() }

  onEdit(u: PersonIdentityDTO) {
    this.isEditMode = true;
    this.editUserId = u.person.id;

    this.editForm = {
      firstName: u.person.firstName,
      lastName: u.person.lastName,
      phone: u.person.phone,
      email: u.user?.email ?? '',
      address: u.person.address ?? '',
      role: (u.user?.role ?? null) as Role | null,
      supplier: u.supplier ? {
        specialty: u.supplier.specialty ?? '',
        notes: u.supplier.notes ?? ''
      } : null
    };

    this.editModalOpen = true;
  }

  openCreateModal() {
    this.isEditMode = false;
    this.editUserId = null;
    this.userForm = this.createEmptyForm();
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }

  closeEditModal() {
    this.editModalOpen = false;
    this.editUserId = null;
  }

  createUser() {
    const f = this.userForm;

    const companyId =
      this.currentUser?.role === 'OWNER'
        ? f.companyId
        : this.currentUser?.companyId;

    if (!companyId) {
      console.error('Company ID is required');
      return;
    }

    const payload: any = {
      person: {
        firstName: f.firstName,
        lastName: f.lastName,
        phone: f.phone,
        email: f.email,
        address: f.address ?? '',
        companyId
      },
      user: null,
      supplier: null,
      customer: null
    };

    if (f.accountType !== 'STAFF') {
      payload.user = {
        email: f.email,
        password: f.password,
        companyId,
        role: f.role
      };
    }

    if (f.accountType !== 'USER') {
      payload.supplier = {
        companyId,
        specialty: f.specialty,
        notes: f.notes
      };
    }

    this.personService.create(payload).subscribe({
      next: () => {
        this.modalOpen = false;
        this.loadUsers();
      },
      error: console.error
    });
  }

  updateUser() {
    if (!this.editUserId) {
      console.error('No user ID for update');
      return;
    }

    const f = this.editForm;

    const payload: any = {
      person: {
        firstName: f.firstName,
        lastName: f.lastName,
        phone: f.phone,
        address: f.address
      }
    };

    if (f.role) {
      payload.user = {
        email: f.email,
        role: f.role
      };
    }

    if (f.supplier) {
      payload.supplier = {
        specialty: f.supplier.specialty,
        notes: f.supplier.notes
      };
    }

    this.personService.patch(this.editUserId, payload).subscribe({
      next: () => {
        // Cerrar el modal de edición después de guardar
        this.editModalOpen = false;
        this.editUserId = null;
        this.loadUsers();
      },
      error: console.error
    });
  }

  submit() {
    if (this.isEditMode) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  // MÉTODOS PARA ELIMINAR CON CONFIRMACIÓN
  onDelete(user: PersonIdentityDTO) {
    this.userToDelete = user;
    this.deleteModalOpen = true;
  }

  closeDeleteModal() {
    this.deleteModalOpen = false;
    this.userToDelete = null;
  }

  confirmDelete() {
    if (!this.userToDelete) return;

    this.personService.delete(this.userToDelete.person.id).subscribe({
      next: () => {
        this.deleteModalOpen = false;
        this.userToDelete = null;
        this.loadUsers();
      },
      error: console.error
    });
  }

  private createEmptyForm(): UserForm {
    return {
      accountType: 'USER',
      companyId: null,
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      password: '',
      address: '',
      specialty: '',
      notes: '',
      role: 'USER'
    };
  }

  private createEmptyEditForm(): EditUserForm {
    return {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: '',
      role: null,
      supplier: null
    };
  }
}