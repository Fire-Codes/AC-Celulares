import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosTecnicosComponent } from './servicios-tecnicos.component';

describe('ServiciosTecnicosComponent', () => {
  let component: ServiciosTecnicosComponent;
  let fixture: ComponentFixture<ServiciosTecnicosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiciosTecnicosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiciosTecnicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
