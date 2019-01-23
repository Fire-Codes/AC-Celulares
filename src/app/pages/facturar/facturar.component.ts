import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';

// Importacion del componente para los modales
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

const NAMES = ['Edycar', 'Susan', 'Jaime', 'Edmundo', 'Carmen'];

export interface UserData {
  id: string;
  Nombre: string;
  Telefono: string;
  Tipo: string;
  Cedula: String;
}

export interface State {
  flag: string;
  name: string;
  population: string;
}

export interface Producto {
  id: string;
  Precio: number;
  Descuento: number;
  Cantidad: number;
  Producto: string;
  Modelo: string;
  ValorCordoba: number;
  ValorDolar: number;
}

@Component({
  selector: 'app-facturar',
  templateUrl: './facturar.component.html',
  styleUrls: ['./facturar.component.scss']
})
export class FacturarComponent implements OnInit {
  stateCtrl = new FormControl();
  filteredStates: Observable<State[]>;

  displayedColumns: string[] = ['id', 'Producto', 'Modelo', 'Precio', 'Descuento', 'Cantidad', 'TotalCordoba', 'TotalDolar', 'Acciones'];
  dataSource: MatTableDataSource<Producto>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  states: State[] = [
    {
      name: 'Arkansas',
      population: '2.978M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Arkansas.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arkansas.svg'
    },
    {
      name: 'California',
      population: '39.14M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_California.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg'
    },
    {
      name: 'Florida',
      population: '20.27M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Florida.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg'
    },
    {
      name: 'Texas',
      population: '27.47M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Texas.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Texas.svg'
    }
  ];
  productos: Producto[];
  constructor(
    public ngbModal: NgbModal
  ) {
    this.filteredStates = this.stateCtrl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this._filterStates(state) : this.states.slice())
      );
    // Create 100 users
    const productos = Array.from({ length: 10 }, (_, k) => crearProductos(k + 1));
    this.productos = productos;
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(productos);
  }

  ngOnInit() {
    // Sort table components init
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  _filterStates(value: string): State[] {
    const filterValue = value.toLowerCase();

    return this.states.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
  }

  // funcion para abrir los modales de manera centrada
  openVerticallyCentered(content: string, cliente: UserData) {
    this.ngbModal.open(content, { centered: true });
  }

  /** Gets the total cost of all transactions. */
  totalCordoba() {
    return this.productos.map(t => t.ValorCordoba).reduce((acc, value) => acc + value, 0);
  }
  totalDolar() {
    return this.productos.map(t => t.ValorDolar).reduce((acc, value) => acc + value, 0);
  }
}

/** Builds and returns a new User. */
function crearProductos(id: number): Producto {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

  return {
    id: id.toString(),
    Producto: name,
    Modelo: name,
    Precio: Math.round(Math.random() * 100),
    Descuento: Math.round(Math.random() * 100),
    Cantidad: Math.round(Math.random() * 100),
    ValorCordoba: Math.round(Math.random() * 1000),
    ValorDolar: Math.round(Math.random() * 10000),
  };
}

