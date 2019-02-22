import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';

// importacion del componente del NavSide
import { NavsideComponent } from '../navside/navside.component';

// importacion del servicio
import { ServicioService } from 'src/app/servicios/servicio.service';

// importacion de las interfaces
import { ProductoFactura } from '../../interfaces/producto-factura';
import { Usuario } from 'src/app/interfaces/usuario';
import { Cliente } from 'src/app/interfaces/cliente';
import { Producto } from 'src/app/interfaces/producto';
import { ControlTienda } from 'src/app/interfaces/control';

// importacion de los componentes de la base de datos
import { AngularFirestoreCollection, AngularFirestore, Action, DocumentSnapshot } from 'angularfire2/firestore';

// Importacion del componente para los modales
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-facturar',
  templateUrl: './facturar.component.html',
  styleUrls: ['./facturar.component.scss']
})
export class FacturarComponent implements OnInit {

  // variable que contiene los datos de la tabla y las columnas a ser mostradas
  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = ['id', 'Producto', 'Marca', 'Modelo', 'Precio', 'Descuento', 'Cantidad', 'TotalCordoba', 'TotalDolar', 'Acciones'];
  productosFactura: MatTableDataSource<ProductoFactura>;

  // variable que es de tipo observable del matsort de la tabla
  @ViewChild(MatSort) sort: MatSort;

  // variable que almacena el tipo de cambio en su tiempo real
  tipoCambioMoneda: number;

  // variable que contendra el producto seleccionado a venderse
  public productoSeleccionado: Producto = null;

  // variable que contendra el poducto seleccionado para calcular su descuento
  public productoSeleccionadoDescuento: Producto = null;

  // variable que contendra el producto seleccionado para eliminar de la tabla
  public productoEliminar: ProductoFactura;

  // variables que almacenara el tipo de descuento a realizar y sus valores
  tipoDescuento = '';
  cantidadDescuento = 0;
  cantidadCalcularDescuento = 0;
  tipoDescuentoCantidad = false;
  venderPrecioCompra = false;
  public precioFinal = 0;

  // variable que almacena la cantidad de unidades que se venderan
  cantidadVender = 0;

  // variables que almacenan los documentos de firestore
  clientes: Observable<Cliente[]>;
  usuarios: Observable<Usuario[]>;

  // variables que almacenaran los valores de busqueda para los documentos de firestore
  valordebusquedaCliente = '';
  valordebusquedaVendedor = '';

  // variable que almacena el array de productos que se agregaran al mattable
  productos: ProductoFactura[];

  // variable que determinara si tienen o no datos el mattable
  hayDatosEnTabla = false;


  constructor(
    public ngbModal: NgbModal,
    public fs: AngularFirestore,
    public servicio: ServicioService,
    public nav: NavsideComponent
  ) {

    // se inicializa la variable de tipo de cambio de moneda
    this.fs.doc('AC Celulares/Control').snapshotChanges()
      .subscribe((control: Action<DocumentSnapshot<ControlTienda>>) => {
        this.tipoCambioMoneda = control.payload.data()['Tipo de Cambio'];
      });

    // se inicializa el array a 0
    this.productos = [];


    // Se asigna el array de productos al contenido de la tabla
    this.productosFactura = new MatTableDataSource(this.productos);
  }

  ngOnInit() {
    // se inicializa el matsort de la tabla con los datos existentes
    this.productosFactura.sort = this.sort;

    // se manda a inicializar los datos para los autocomplete de los clientes y vendedores
    this.buscarClientes();
    this.buscarVendedor();
  }

  // funcion para cambiar el tipo de descuento
  cambiarTipodescuento() {
    this.tipoDescuentoCantidad = !this.tipoDescuentoCantidad;
    this.cantidadCalcularDescuento = 0;
    this.cantidadDescuento = 0;
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
  openVerticallyCentered(content: string, productoEliminar: ProductoFactura) {
    this.productoEliminar = productoEliminar;
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
    // this.nav.mostrarNav = false;
    setTimeout(() => {
      // return xepOnline.Formatter.Format('content', { render: 'download' });
      // window.print();
    }, 1000);
  }

  // funcion para vender a precio de compra
  venderAPrecioCompra() {
    if (this.venderPrecioCompra) {
      this.cantidadDescuento = this.productoSeleccionado.PVenta - this.productoSeleccionado.PCompra;
      this.precioFinal = this.productoSeleccionado.PVenta - this.cantidadDescuento;
    } else {
      this.cantidadDescuento = 0;
      this.precioFinal = this.productoSeleccionado.PVenta;
    }
  }

  // funcion para agregar el descuento
  agregarDescuento() {
    this.precioFinal -= this.cantidadDescuento;
  }

  // funcion que se ejecutara cada vez que el usuario le de click en agregar producto a factura
  agregarProductoFactura() {
    if (this.cantidadVender > this.productoSeleccionado.Existencia) {
      this.servicio.newToast(0, 'Error de Stock', 'La cantidad a vender no puede ser mayor a la cantidad en stock del producto');
    } else if (this.precioFinal < this.productoSeleccionado.PCompra) {
      this.servicio.newToast(0, 'Error de Precio', 'El precio final del producto no puede ser menor al precio de compra del mismo');
    } else if (this.cantidadVender === 0) {
      this.servicio.newToast(0, 'Error de Cantidad', 'Debe de agregar al menos 1 producto en campo "Cantidad"');
    } else if (this.productoSeleccionado == null) {
      this.servicio.newToast(0, 'Error de Insercción', 'Debe de seleccionar un producto antes de agregarlo');
    } else {
      this.productos.push({
        id: this.productoSeleccionado.Id,
        Producto: this.productoSeleccionado.Nombre,
        Modelo: this.productoSeleccionado.Modelo,
        Precio: this.productoSeleccionado.PVenta,
        Descuento: this.cantidadDescuento,
        Cantidad: this.cantidadVender,
        ValorCordoba: this.cantidadVender * this.precioFinal,
        // tslint:disable-next-line:max-line-length
        ValorDolar: Math.round(((this.cantidadVender * this.precioFinal) / this.tipoCambioMoneda) * 100) / 100,
        Marca: this.productoSeleccionado.Marca
      });
      this.productosFactura = new MatTableDataSource(this.productos);
      this.productoSeleccionado = null;
      this.productoSeleccionadoDescuento = null;
      this.precioFinal = 0;
      this.cantidadVender = 0;
      this.cantidadDescuento = 0;
      // this.servicio.newToast(1, 'Insercción Correcta!', 'El producto se agrego correctamente a la factura');
      this.hayDatosEnTabla = true;
    }
  }

  // eliminar producto de la factura
  eliminarProductoFactura() {
    this.productosFactura.data.forEach((producto, index) => {
      if (this.productoEliminar.id === producto.id) {
        this.productos.splice(index, 1);
        this.productosFactura = new MatTableDataSource(this.productos);
      }
    });
  }

  // funcion para calcular el descuento segun su tipo
  calcularDescuento() {
    switch (this.tipoDescuento) {
      case 'porcentaje':
        this.cantidadDescuento = (this.cantidadCalcularDescuento * this.productoSeleccionado.PVenta) / 100;
        break;
      case 'cantidad':
        this.cantidadDescuento = this.cantidadCalcularDescuento;
        break;
      default:
        break;
    }
  }
}
