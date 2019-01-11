import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturarComponent } from './facturar.component';

describe('FacturarComponent', () => {
  let component: FacturarComponent;
  let fixture: ComponentFixture<FacturarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
