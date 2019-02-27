import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprimirComponent } from './imprimir.component';

describe('ImprimirComponent', () => {
  let component: ImprimirComponent;
  let fixture: ComponentFixture<ImprimirComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImprimirComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprimirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
