import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsNotificationsCard } from './settings-notifications-card';

describe('SettingsNotificationsCard', () => {
  let component: SettingsNotificationsCard;
  let fixture: ComponentFixture<SettingsNotificationsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsNotificationsCard],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsNotificationsCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
