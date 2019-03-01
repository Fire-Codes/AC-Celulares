import { Component, OnInit } from '@angular/core';
import { ServicioService } from 'src/app/servicios/servicio.service';
import { NavsideComponent } from '../../navside/navside.component';

@Component({
  selector: 'app-imprimir-factura',
  templateUrl: './imprimir-factura.component.html',
  styleUrls: ['./imprimir-factura.component.scss']
})
export class ImprimirFacturaComponent implements OnInit {

  constructor(
    public servicio: ServicioService,
    public nav: NavsideComponent
  ) { }

  ngOnInit() {
    this.nav.mostrarNav = false;

  }

  // navegar
  navegar() {
    this.servicio.navegar('dashboard');
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
}
