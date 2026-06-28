import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layout/header/header';
import { SessionService } from '../../services/user-session/user-session';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './companies.html',
  styleUrl: './companies.scss',
})
export class CompaniesComponent {

  private session = inject(SessionService);

  user$ = this.session.getMe();
}