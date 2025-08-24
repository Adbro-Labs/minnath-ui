import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratedQuotesComponent } from './generated-quotes.component';

describe('GeneratedQuotesComponent', () => {
  let component: GeneratedQuotesComponent;
  let fixture: ComponentFixture<GeneratedQuotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneratedQuotesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneratedQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
