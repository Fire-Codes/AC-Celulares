import { Component, OnInit, ViewChild } from '@angular/core';

// importacion del componente navside
import { NavsideComponent } from '../navside/navside.component';

// importacion de los componentes de @angular/material
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

// importacion de los componentes de ng-bootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


export interface Producto {
  Clave: string;
  Nombre: string;
  Marca: string;
  Categoria: string;
  Modelo: string;
  Existencia: number;
  pCompra: number;
  pVenta: number;
}
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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['Clave', 'Nombre', 'Marca', 'Modelo', 'Categoria', 'Existencia', 'pCompra', 'pVenta', 'Acciones'];
  dataSource: MatTableDataSource<Producto>;

  constructor(
    public nav: NavsideComponent,
    public ngbModal: NgbModal
  ) {
    // se muestra el navside
    this.nav.mostrarNav = true;

    // Create 100 users
    const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
  }

  ngOnInit() {

    // se inicializan las variables para el mattable de sort y paginator
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  // funcion para buscar en las tablas
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


/** Builds and returns a new User. */
function createNewUser(Clave: number): Producto {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

  return {
    Clave: Clave.toString(),
    Nombre: name,
    Marca: MARCA[Math.round(Math.random() * (MARCA.length - 1))],
    Categoria: Categoria[Math.round(Math.random() * (Categoria.length - 1))],
    Modelo: MODELO[Math.round(Math.random() * (MODELO.length - 1))],
    Existencia: Math.round(Math.random() * 100),
    pCompra: Math.round(Math.random() * 1000),
    pVenta: Math.round(Math.random() * 10000),
  };
}
