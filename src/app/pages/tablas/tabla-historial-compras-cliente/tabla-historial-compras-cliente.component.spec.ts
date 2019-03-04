import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaHistorialComprasClienteComponent } from './tabla-historial-compras-cliente.component';

describe('TablaHistorialComprasClienteComponent', () => {
  let component: TablaHistorialComprasClienteComponent;
  let fixture: ComponentFixture<TablaHistorialComprasClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaHistorialComprasClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaHistorialComprasClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
