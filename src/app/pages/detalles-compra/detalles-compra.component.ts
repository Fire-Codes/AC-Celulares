import { Component, OnInit } from '@angular/core';


// se importa el servicio
import { ServicioService } from 'src/app/servicios/servicio.service';

@Component({
  selector: 'app-detalles-compra',
  templateUrl: './detalles-compra.component.html',
  styleUrls: ['./detalles-compra.component.scss']
})
export class DetallesCompraComponent implements OnInit {

  constructor(
    public servicio: ServicioService
  ) { }

  ngOnInit() {
  }

  // funcion para regresar a la tabla de clientes
  regresar() {
    this.servicio.navegar('clientes');
    this.servicio.ClienteVerCompras = null;
  }

}
