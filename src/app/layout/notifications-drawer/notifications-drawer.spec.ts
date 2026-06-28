import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsDrawerComponent } from './notifications-drawer';

describe('NotificationsDrawerComponent', () => {
  let component: NotificationsDrawerComponent;
  let fixture: ComponentFixture<NotificationsDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationsDrawerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsDrawerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
