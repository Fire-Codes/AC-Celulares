import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// se importan las interfaces
import { Usuario } from './../../../interfaces/usuario';
import { Producto } from './../../../interfaces/producto';
import { ProductoFactura } from './../../../interfaces/producto-factura';

// importacion del servicio
import { ServicioService } from 'src/app/servicios/servicio.service';

// importacion de los componentes de la base de datos
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';


@Component({
  selector: 'app-venta-rapida',
  templateUrl: './venta-rapida.component.html',
  styleUrls: ['./venta-rapida.component.scss']
})
export class VentaRapidaComponent implements OnInit {

  // variable que emitira el evento para cuando se deba de cerra el modal
  @Output() cerrarModalVentaRapida = new EventEmitter();

  // variables que contendran ya se al usuario o al producto inicial
  @Input() usuario: Usuario = null;
  @Input() producto: Producto = null;

  constructor(
    public servicio: ServicioService,
    public fs: AngularFirestore,
    public db: AngularFireDatabase
  ) { }

  ngOnInit() {
  }

  // funcion para cerra el modal
  cerrarModal() {
    this.cerrarModalVentaRapida.emit();
  }
}
