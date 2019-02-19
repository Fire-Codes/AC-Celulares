import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarProductoDescuentoComponent } from './seleccionar-producto-descuento.component';

describe('SeleccionarProductoDescuentoComponent', () => {
  let component: SeleccionarProductoDescuentoComponent;
  let fixture: ComponentFixture<SeleccionarProductoDescuentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeleccionarProductoDescuentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleccionarProductoDescuentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
