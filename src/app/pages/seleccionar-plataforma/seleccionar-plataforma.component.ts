import { Component, OnInit } from '@angular/core';

// importacion del componente del navside
import { NavsideComponent } from '../navside/navside.component';

// importacion del servicio
import { ServicioService } from 'src/app/servicios/servicio.service';

@Component({
  selector: 'app-seleccionar-plataforma',
  templateUrl: './seleccionar-plataforma.component.html',
  styleUrls: ['./seleccionar-plataforma.component.scss']
})
export class SeleccionarPlataformaComponent implements OnInit {

  constructor(
    public nav: NavsideComponent,
    public servicio: ServicioService
  ) {
    this.nav.mostrarNav = false;
  }

  ngOnInit() {
  }

  // funcion para seleccionar la tienda deseada
  seleccionarTienda(tienda: string) {
    this.servicio.tienda = tienda;
    setTimeout(() => {
      this.servicio.navegar('dashboard');
    }, 1000);
  }

}
