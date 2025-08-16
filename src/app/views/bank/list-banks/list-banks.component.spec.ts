import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBanksComponent } from './list-banks.component';

describe('ListBanksComponent', () => {
  let component: ListBanksComponent;
  let fixture: ComponentFixture<ListBanksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListBanksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListBanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
