import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservarProductoComponent } from './reservar-producto.component';

describe('ReservarProductoComponent', () => {
  let component: ReservarProductoComponent;
  let fixture: ComponentFixture<ReservarProductoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservarProductoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservarProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
