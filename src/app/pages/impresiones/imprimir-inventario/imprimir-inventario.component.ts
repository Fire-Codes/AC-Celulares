import { Producto } from 'src/app/interfaces/producto';
import { Component, OnInit } from '@angular/core';

// se importa el componente del navSide para ocultarlo
import { NavsideComponent } from './../../navside/navside.component';

// se importa el servicio
import { ServicioService } from 'src/app/servicios/servicio.service';

@Component({
  selector: 'app-imprimir-inventario',
  templateUrl: './imprimir-inventario.component.html',
  styleUrls: ['./imprimir-inventario.component.scss']
})
export class ImprimirInventarioComponent implements OnInit {

  // variable que contendra todos los datos a imprimirse
  imprimirInventario: Producto[];

  constructor(
    public servicio: ServicioService,
    public nav: NavsideComponent
  ) {
    // tslint:disable-next-line:max-line-length
    // se asigna el contenido del servicio de la variable inventarioImprimir a la variable local que contendra los datos a imprimir del inventario
    this.imprimirInventario = this.servicio.inventarioImprimir;

    // se oculta el nav para que no aparezca en la impresion
    this.nav.mostrarNav = false;
  }

  ngOnInit() {
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

  // navegar
  navegar() {
    this.servicio.navegar('inventario');
  }

  // funcion que retorna la fecha y hora actual
  fecha(): string {
    const tiempo = new Date();
    // tslint:disable-next-line:max-line-length
    return `${tiempo.getDate()}/${this.servicio.meses[tiempo.getMonth()]}/${tiempo.getFullYear()}, ${tiempo.getHours()}:${tiempo.getMinutes()}:${tiempo.getSeconds()}`;
  }

}
