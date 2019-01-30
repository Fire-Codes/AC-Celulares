import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarPlataformaComponent } from './seleccionar-plataforma.component';

describe('SeleccionarPlataformaComponent', () => {
  let component: SeleccionarPlataformaComponent;
  let fixture: ComponentFixture<SeleccionarPlataformaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeleccionarPlataformaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleccionarPlataformaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
