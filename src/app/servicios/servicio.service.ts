import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  constructor(
    public router: Router
  ) { }

  public navegar(ruta: string) {
    this.router.navigate([`/${ruta}`]);
  }
}
