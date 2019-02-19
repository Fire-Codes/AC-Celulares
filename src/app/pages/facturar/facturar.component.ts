import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';

// importacion de las interfaces
import { ProductoFactura } from '../../interfaces/producto-factura';
import { Usuario } from 'src/app/interfaces/usuario';
import { Cliente } from 'src/app/interfaces/cliente';
import { Producto } from 'src/app/interfaces/producto';

// Importacion del componente para los modales
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

const NAMES = ['Edycar', 'Susan', 'Jaime', 'Edmundo', 'Carmen'];


@Component({
  selector: 'app-facturar',
  templateUrl: './facturar.component.html',
  styleUrls: ['./facturar.component.scss']
})
export class FacturarComponent implements OnInit {
  stateCtrl = new FormControl();
  public itemsCollection: AngularFirestoreCollection<Usuario>;
  items: Observable<Usuario[]>;

  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = ['id', 'Producto', 'Marca', 'Modelo', 'Precio', 'Descuento', 'Cantidad', 'TotalCordoba', 'TotalDolar', 'Acciones'];
  dataSource: MatTableDataSource<ProductoFactura>;
  @ViewChild(MatSort) sort: MatSort;

  // variable que contendra el producto seleccionado a venderse
  public productoSeleccionado: Producto;

  // variable que contendra el poducto seleccionado para calcular su descuento
  public productoSeleccionadoDescuento: Producto;


  clientes: Observable<Cliente[]>;
  usuarios: Observable<Usuario[]>;
  valordebusquedaCliente = '';
  valordebusquedaVendedor = '';
  productos: ProductoFactura[];
  constructor(
    public ngbModal: NgbModal,
    public fs: AngularFirestore
  ) {
    // Create 100 users
    const productos = Array.from({ length: 10 }, (_, k) => crearProductos(k + 1));
    this.productos = productos;
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(productos);
  }

  ngOnInit() {
    // Sort table components init
    this.dataSource.sort = this.sort;
    this.buscarClientes();
    this.buscarVendedor();
  }

  // funcion que se ejecutara cuando un cliente se seleccione
  seleccionarCliente(cliente: Cliente) {
    console.log('CLICKED');
    console.log(cliente.Id);
  }

  // funcion que se ejecutara cuando un vendedor se seleccione
  seleccionarUsuario(vendedor: Usuario) {
    console.log('CLICKED');
    console.log(vendedor.UID);
  }

  // funcion para buscar cliente
  buscarClientes() {
    // tslint:disable-next-line:prefer-const
    let self = this;
    self.clientes = self.fs.collection<Cliente>('AC Celulares/Control/Clientes', ref => ref
      .orderBy('NombreCompleto')
      .startAt(self.valordebusquedaCliente.toUpperCase())
      .endAt(self.valordebusquedaCliente.toUpperCase() + '\uf8ff')
      .limit(10)
    ).valueChanges();
  }

  // funcion para buscar vendedor
  buscarVendedor() {
    // tslint:disable-next-line:prefer-const
    let self = this;
    self.usuarios = self.fs.collection<Usuario>('AC Celulares/Control/Usuarios', ref => ref
      .orderBy('Nombres')
      .startAt(self.valordebusquedaVendedor.toUpperCase())
      .endAt(self.valordebusquedaVendedor.toUpperCase() + '\uf8ff')
      .limit(10)
    ).valueChanges();
  }

  // funcion para abrir los modales de manera centrada
  openVerticallyCentered(content: string) {
    this.ngbModal.open(content, { centered: true });
  }

  /** Gets the total cost of all transactions. */
  totalCordoba() {
    return this.productos.map(t => t.ValorCordoba).reduce((acc, value) => acc + value, 0);
  }
  totalDolar() {
    return this.productos.map(t => t.ValorDolar).reduce((acc, value) => acc + value, 0);
  }

  // funcion para imprimir
  imprimirFactura() {
    window.print();
  }
}

/** Builds and returns a new User. */
function crearProductos(id: number): ProductoFactura {
  const producto =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';
  const modelo =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';
  const marca =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

  return {
    id: id.toString(),
    Producto: producto,
    Modelo: modelo,
    Precio: Math.round(Math.random() * 100),
    Descuento: Math.round(Math.random() * 100),
    Cantidad: Math.round(Math.random() * 100),
    ValorCordoba: Math.round(Math.random() * 1000),
    ValorDolar: Math.round(Math.random() * 10000),
    Marca: marca
  };
}

