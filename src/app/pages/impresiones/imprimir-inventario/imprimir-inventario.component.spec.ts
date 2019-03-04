import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprimirInventarioComponent } from './imprimir-inventario.component';

describe('ImprimirInventarioComponent', () => {
  let component: ImprimirInventarioComponent;
  let fixture: ComponentFixture<ImprimirInventarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImprimirInventarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprimirInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
