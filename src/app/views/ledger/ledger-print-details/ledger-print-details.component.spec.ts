import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerPrintDetailsComponent } from './ledger-print-details.component';

describe('LedgerPrintDetailsComponent', () => {
  let component: LedgerPrintDetailsComponent;
  let fixture: ComponentFixture<LedgerPrintDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LedgerPrintDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LedgerPrintDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
