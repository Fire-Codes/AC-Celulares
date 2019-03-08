import { Factura } from './../../../interfaces/factura';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';

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
  @Input() productosFactura: Factura = null;

  // variable que contendra el arreglo de todos los articulos comprados
  articulos: any[];

  @Output() cerrarProductosComprados = new EventEmitter();

  constructor() { }

  ngOnInit() {
    if (this.compra === null) {
      this.articulos = this.productosFactura.Productos;
    } else {
      this.articulos = this.compra['Articulos Comprados'];
    }
  }

  // funcion para cerra el modal
  cerrarModal() {
    this.cerrarProductosComprados.emit();
    this.compra = null;
    this.productosFactura = null;
  }

}
