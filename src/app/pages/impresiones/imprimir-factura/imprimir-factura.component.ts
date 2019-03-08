import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ServicioService } from 'src/app/servicios/servicio.service';
import { NavsideComponent } from '../../navside/navside.component';

// se importa la interfaz de tipo factura
import { Factura } from './../../../interfaces/factura';

// se importa el servicio

@Component({
  selector: 'app-imprimir-factura',
  templateUrl: './imprimir-factura.component.html',
  styleUrls: ['./imprimir-factura.component.scss']
})
export class ImprimirFacturaComponent implements OnInit {

  // variable qu contendra la factura que se le pase por parametro
  public facturaImprimir: Factura = this.servicio.facturaImprimir;

  constructor(
    public servicio: ServicioService,
    public nav: NavsideComponent
  ) { }

  ngOnInit() {
    this.nav.mostrarNav = false;

  }

  // navegar
  navegar() {
    this.servicio.navegar('facturar');
  }

  // imprimir
  imprimir() {
    const btnRegresar = document.getElementById('btnRegresar');
    const btnImprimir = document.getElementById('btnImprimir');
    btnRegresar.hidden = true;
    btnImprimir.hidden = true;
    window.print();
    btnRegresar.hidden = false;
    btnImprimir.hidden = false;
  }

  // calcular el total de la factura sin descuentos
  totalSinDescuento(): number {
    return this.facturaImprimir.Productos.map(t => t.Precio).reduce((acc, value) => acc + value, 0);
  }
}
