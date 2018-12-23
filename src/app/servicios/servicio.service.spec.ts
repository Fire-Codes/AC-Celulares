import { TestBed } from '@angular/core/testing';

import { ServicioService } from './servicio.service';

describe('ServicioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServicioService = TestBed.get(ServicioService);
    expect(service).toBeTruthy();
  });
});
