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
import { Observable } from 'rxjs';

/** Constants used to fill up our data base. */
const Categoria: string[] = ['Accesorio', 'Repuesto', 'Celular', 'Herramienta', 'Otro'];
const NAMES: string[] = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
  'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
  'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];
const MARCA: string[] = ['SAMSUNG', 'LG', 'HUAWEI', 'SONY', 'APPLE'];
const MODELO: string[] = ['GALAXY S7', 'G5', 'P20 Pro', 'XPERIA Z4', 'iPhone 5S'];

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit {

  // varible para la cantidad de productos actuales y las categorias existentes
  totalProductos: number;
  categorias: string[];

  // variables que contendra todos los productos
  coleccionDeProductos: AngularFirestoreCollection<Producto>;
  productos: Observable<Producto[]>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['Clave', 'Nombre', 'Marca', 'Modelo', 'Categoria', 'Existencia', 'pCompra', 'pVenta', 'Acciones'];
  dataSource: MatTableDataSource<Producto>;

  constructor(
    public nav: NavsideComponent,
    public ngbModal: NgbModal,
    public fs: AngularFirestore
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
  }

}


// funcion para crear un nuevo producto
function createNewUser(Id: number): Producto {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

  return {
    Id: 'PROD' + Id,
    Nombre: name,
    Marca: MARCA[Math.round(Math.random() * (MARCA.length - 1))],
    Categoria: Categoria[Math.round(Math.random() * (Categoria.length - 1))],
    Modelo: MODELO[Math.round(Math.random() * (MODELO.length - 1))],
    Existencia: Math.round(Math.random() * 100),
    PCompra: Math.round(Math.random() * 1000),
    PVenta: Math.round(Math.random() * 10000),
    Estado: 'Disponible',
    Descripcion: 'Audifonos genéricos marca apple modelo airpods color azul.'
  };
}
