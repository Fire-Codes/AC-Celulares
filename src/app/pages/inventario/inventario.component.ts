import { Component, OnInit, ViewChild } from '@angular/core';

// importacion del componente navside
import { NavsideComponent } from '../navside/navside.component';

// importacion de los componentes de @angular/material
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

// importacion de los componentes de firestore
// tslint:disable-next-line:max-line-length
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, Action, DocumentSnapshot, DocumentChangeAction } from 'angularfire2/firestore';

// importacion de la interfaz para el producto
import { Producto } from '../../interfaces/producto';

// importacion de la interfaz para los campos de las tiendas
import { CamposTiendas } from '../../interfaces/campos-tiendas';

// importacion de los componentes de ng-bootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// importacion del servicio
import { ServicioService } from '../../servicios/servicio.service';

import { Observable } from 'rxjs';


@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit {

  // variable para mostrar, agregar datos, eliminar producto, editar y archivar un producto y se inicializa a null
  producto: Producto = null;

  // varible para la cantidad de productos actuales y las categorias existentes
  totalProductos: number;
  categorias: string[];

  // variables que contendra todos los productos
  coleccionDeProductos: AngularFirestoreCollection<Producto>;

  // variables de tipo observer para paginator y sort
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['Clave', 'Nombre', 'Marca', 'Modelo', 'Categoria', 'Existencia', 'pCompra', 'pVenta', 'Acciones'];
  dataSource: MatTableDataSource<Producto>;

  // se declaran las variables para la modificacion de datos para cada producto


  constructor(
    public nav: NavsideComponent,
    public ngbModal: NgbModal,
    public fs: AngularFirestore,
    public servicio: ServicioService
  ) {
    // se muestra el navside
    this.nav.mostrarNav = true;

    // Se extraen todos los productos ingresados
    this.coleccionDeProductos = this.fs.collection<Producto>('AC Celulares/Control/Inventario/Tienda Principal/Productos');
    this.coleccionDeProductos.valueChanges().subscribe(documento => {
      // Assign the data to the data source for the table to render
      this.dataSource = new MatTableDataSource(documento);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnInit() {

    // se extraen la cantidad de productos actual y las categorias actualmente existentes
    // tslint:disable-next-line:max-line-length
    this.fs.doc('AC Celulares/Control/Inventario/Tienda Principal').snapshotChanges().subscribe((campos: Action<DocumentSnapshot<CamposTiendas>>) => {
      this.totalProductos = campos.payload.data()['Cantidad de Productos'];
      this.categorias = campos.payload.data().Categorias;
    });

    // se inicializan las variables para el mattable de sort y paginator
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  // funcion para buscar producto en la tabla
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // funcion para abrir los modales de manera centrada
  openVerticallyCentered(content: string, producto: Producto) {
    this.ngbModal.open(content, { centered: true });
    this.producto = producto;
  }

  // funcion para editar los datos de un producto
  editarProductos() {
    this.fs.doc(`AC Celulares/Control/Inventario/Tienda Principal/Productos/${this.producto.Id}`).update(this.producto)
      .then(response => {
        this.servicio.newToast(1, 'Modificacion Correcta', `El Producto ${this.producto.Id} se ha modificado con éxito`);
      }).catch(err => {
        this.servicio.newToast(0, 'Modificacion Incorrecta', err);
      });
  }

  // funcion para eliminar un producto
  eliminarProductos() {
    this.fs.doc(`AC Celulares/Control/Inventario/Tienda Principal/Productos/${this.producto.Id}`).delete().then(response => {
      this.servicio.newToast(1, 'Eliminación Correcta', `El producto ${this.producto.Id} se ha eliminado correctamente`);
    }).catch(err => {
      this.servicio.newToast(1, 'Eliminación Incorrecta', err);
    });
  }

}


// funcion para crear un nuevo producto
function createNewUser() {
}
