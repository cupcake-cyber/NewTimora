import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsChannelsCard } from './settings-channels-card';

describe('SettingsChannelsCard', () => {
  let component: SettingsChannelsCard;
  let fixture: ComponentFixture<SettingsChannelsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsChannelsCard],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsChannelsCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
