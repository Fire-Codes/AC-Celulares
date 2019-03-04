import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosReservadosComponent } from './productos-reservados.component';

describe('ProductosReservadosComponent', () => {
  let component: ProductosReservadosComponent;
  let fixture: ComponentFixture<ProductosReservadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductosReservadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductosReservadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
