import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Producto } from 'src/app/interfaces/producto';
import { FacturarComponent } from './../../facturar/facturar.component';

// se importa el servicio
import { ServicioService } from './../../../servicios/servicio.service';

// importacion de los componentes de firestore
// tslint:disable-next-line:max-line-length
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, Action, DocumentSnapshot, DocumentChangeAction } from 'angularfire2/firestore';

@Component({
  selector: 'app-seleccionar-producto',
  templateUrl: './seleccionar-producto.component.html',
  styleUrls: ['./seleccionar-producto.component.scss']
})
export class SeleccionarProductoComponent implements OnInit {

  // variables de tipo observer para paginator y sort
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['Nombre', 'Marca', 'Modelo', 'Categoria', 'Acciones'];
  productos: MatTableDataSource<Producto>;

  // variables que contendra todos los productos
  coleccionDeProductos: AngularFirestoreCollection<Producto>;

  // variables para emision de eventos
  @Output() cerrarModalSeleccionarProductos = new EventEmitter();

  constructor(
    public fs: AngularFirestore,
    public servicio: ServicioService,
    public factura: FacturarComponent
  ) {
    // Se extraen todos los productos ingresados
    this.coleccionDeProductos = this.fs.collection<Producto>('AC Celulares/Control/Inventario/Tienda Principal/Productos');
    this.coleccionDeProductos.valueChanges().subscribe(documento => {
      // Assign the data to the data source for the table to render
      this.productos = new MatTableDataSource(documento);
      this.productos.sort = this.sort;
      this.productos.paginator = this.paginator;
      console.log(this.productos.data.length);
    });
  }

  ngOnInit() {
  }

  // funcion para emitir el evento para cerrar el modal
  cerrarModal() {
    this.cerrarModalSeleccionarProductos.emit();
  }

  // funcion para buscar producto en la tabla
  applyFilter(filterValue: string) {
    this.productos.filter = filterValue.trim().toLowerCase();

    if (this.productos.paginator) {
      this.productos.paginator.firstPage();
    }
  }

  // funcion para seleccionar el producto
  seleccionarProducto(producto: Producto) {
    this.factura.productoSeleccionado = producto;
    this.factura.precioFinal = producto.PVenta;
    this.cerrarModal();
  }

}
