import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaClientesComponent } from './tabla-clientes.component';

describe('TablaClientesComponent', () => {
  let component: TablaClientesComponent;
  let fixture: ComponentFixture<TablaClientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaClientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
