import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosCompradosComponent } from './productos-comprados.component';

describe('ProductosCompradosComponent', () => {
  let component: ProductosCompradosComponent;
  let fixture: ComponentFixture<ProductosCompradosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductosCompradosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductosCompradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
