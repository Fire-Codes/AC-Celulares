import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SistemaApartadoComponent } from './sistema-apartado.component';

describe('SistemaApartadoComponent', () => {
  let component: SistemaApartadoComponent;
  let fixture: ComponentFixture<SistemaApartadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SistemaApartadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SistemaApartadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
