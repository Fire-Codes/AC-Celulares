import { Component, OnInit, ViewChild } from '@angular/core';

// importacion de los componentes de @angular/material
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

// importacion de los componentes de firestore
// tslint:disable-next-line:max-line-length
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, Action, DocumentSnapshot, DocumentChangeAction, QueryDocumentSnapshot, QuerySnapshot } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';

// importacion de la interfaz para el producto
import { Producto } from '../../interfaces/producto';

// importacion de los componentes de ng-bootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// importacion del servicio
import { ServicioService } from '../../servicios/servicio.service';

import { Observable } from 'rxjs';


@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {

  // variable que contendra el valor de busqueda para los productos
  valorBusqueda = '5';

  // variables que contendra todos los productos
  coleccionDeProductos: AngularFirestoreCollection<Producto>;

  // variables de tipo observer para paginator y sort
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['Id', 'Nombre', 'Marca', 'Modelo', 'Categoria', 'Existencia'];
  dataSource: MatTableDataSource<Producto>;

  constructor(
    public ngbModal: NgbModal,
    public fs: AngularFirestore,
    public servicio: ServicioService,
    public db: AngularFireDatabase
  ) {
    this.dataSource = new MatTableDataSource([]);
    this.applyFilter();
  }

  ngOnInit() {
  }

  // funcion para buscar producto en la tabla
  applyFilter() {
    this.dataSource.data = [];
    // Se extraen todos los productos ingresados
    this.coleccionDeProductos = this.fs.collection<Producto>(`AC Celulares/Control/Inventario/${this.servicio.tienda}/Productos`);
    this.coleccionDeProductos.ref.where('Existencia', '<=', parseFloat(this.valorBusqueda)).get().then(documentos => {
      // Assign the data to the data source for the table to render
      documentos.docs.forEach((dato: QueryDocumentSnapshot<Producto>) => {
        this.dataSource.data.push(dato.data());
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
    });
  }

}
