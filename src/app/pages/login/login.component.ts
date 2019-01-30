import { Component, OnInit } from '@angular/core';
import { NavsideComponent } from '../navside/navside.component';

// importacion del servicio
import { ServicioService } from '../../servicios/servicio.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    public nav: NavsideComponent,
    public servicio: ServicioService
  ) {
    this.nav.mostrarNav = false;
  }

  ngOnInit() {
  }
  navegar(ruta: string) {
    this.servicio.navegar(ruta);
  }
}
