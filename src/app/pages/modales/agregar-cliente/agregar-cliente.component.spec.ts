import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarClienteComponent } from './agregar-cliente.component';

describe('AgregarClienteComponent', () => {
  let component: AgregarClienteComponent;
  let fixture: ComponentFixture<AgregarClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
