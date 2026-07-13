import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsAppearanceCard } from './settings-appearance-card';

describe('SettingsAppearanceCard', () => {
  let component: SettingsAppearanceCard;
  let fixture: ComponentFixture<SettingsAppearanceCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsAppearanceCard],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsAppearanceCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
