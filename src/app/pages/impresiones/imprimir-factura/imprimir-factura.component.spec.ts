import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprimirFacturaComponent } from './imprimir-factura.component';

describe('ImprimirFacturaComponent', () => {
  let component: ImprimirFacturaComponent;
  let fixture: ComponentFixture<ImprimirFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImprimirFacturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprimirFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
