import { Component, OnInit } from '@angular/core';

// importacion del componente del navside
import { NavsideComponent } from '../navside/navside.component';

@Component({
  selector: 'app-seleccionar-plataforma',
  templateUrl: './seleccionar-plataforma.component.html',
  styleUrls: ['./seleccionar-plataforma.component.scss']
})
export class SeleccionarPlataformaComponent implements OnInit {

  constructor(
    public nav: NavsideComponent
  ) {
    this.nav.mostrarNav = false;
  }

  ngOnInit() {
  }

}
