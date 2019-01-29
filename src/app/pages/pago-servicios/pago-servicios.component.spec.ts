import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoServiciosComponent } from './pago-servicios.component';

describe('PagoServiciosComponent', () => {
  let component: PagoServiciosComponent;
  let fixture: ComponentFixture<PagoServiciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagoServiciosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
