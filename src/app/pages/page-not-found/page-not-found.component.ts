import { Component, OnInit } from '@angular/core';

// importacion del servicio
import { ServicioService } from '../../servicios/servicio.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  constructor(
    public servicio: ServicioService
  ) { }

  ngOnInit() {
  }

  navegar(ruta: string) {
    this.servicio.navegar(ruta);
  }
}
