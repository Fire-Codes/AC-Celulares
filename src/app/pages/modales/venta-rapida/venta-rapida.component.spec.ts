import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaRapidaComponent } from './venta-rapida.component';

describe('VentaRapidaComponent', () => {
  let component: VentaRapidaComponent;
  let fixture: ComponentFixture<VentaRapidaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentaRapidaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentaRapidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
