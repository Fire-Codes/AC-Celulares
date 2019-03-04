import { Component, OnInit, Input, EventEmitter, ViewChild } from '@angular/core';

// se importan las interfaces
import { HistorialCompra } from './../../../interfaces/historial-compra';
import { ProductoFactura } from './../../../interfaces/producto-factura';

@Component({
  selector: 'app-productos-comprados',
  templateUrl: './productos-comprados.component.html',
  styleUrls: ['./productos-comprados.component.scss']
})
export class ProductosCompradosComponent implements OnInit {

  // variable que se le pasa por tipo input que contendra el id de la compra
  @Input() compra: HistorialCompra = null;

  // variable que contendra el arreglo de todos los articulos comprados
  articulos: ProductoFactura[];

  constructor() { }

  ngOnInit() {
    this.articulos = this.compra['Articulos Comprados'];
  }

}
