import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaHistorialFacturasComponent } from './tabla-historial-facturas.component';

describe('TablaHistorialFacturasComponent', () => {
  let component: TablaHistorialFacturasComponent;
  let fixture: ComponentFixture<TablaHistorialFacturasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaHistorialFacturasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaHistorialFacturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
