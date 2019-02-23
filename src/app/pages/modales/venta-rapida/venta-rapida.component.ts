import { FacturarComponent } from './../../facturar/facturar.component';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

// se importan las interfaces
import { Usuario } from './../../../interfaces/usuario';
import { Producto } from './../../../interfaces/producto';
import { ProductoFactura } from './../../../interfaces/producto-factura';
import { Cliente } from 'src/app/interfaces/cliente';

// importacion del servicio
import { ServicioService } from 'src/app/servicios/servicio.service';

// importacion del angular NgBootstrapModule
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// importacion de los componentes de la base de datos
import { AngularFirestore, Action, DocumentSnapshot } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';
import { SeleccionarProductoComponent } from '../seleccionar-producto/seleccionar-producto.component';
import { MatTableDataSource, MatSort } from '@angular/material';
import { ControlTienda } from 'src/app/interfaces/control';
import { HistorialCompra } from 'src/app/interfaces/historial-compra';


@Component({
  selector: 'app-venta-rapida',
  templateUrl: './venta-rapida.component.html',
  styleUrls: ['./venta-rapida.component.scss']
})
export class VentaRapidaComponent implements OnInit {

  // variable que almacena todos los meses del año
  meses: string[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ];

  // variable que contendra las compras actuales del cliente
  totalComprasActualesCliente: number;

  // variables que almacenan los documentos de firestore
  clientes: Observable<Cliente[]>;
  vendedores: Observable<Usuario[]>;

  // variables que almacenaran los valores de busqueda para los documentos de firestore
  valordebusquedaCliente = '';
  valordebusquedaVendedor = '';

  // variables para calculos de la venta
  venderPrecioCompra = false;
  cantidadDescuento = 0;
  public precioFinal: number;
  tipoDescuento = '';
  cantidadCalcularDescuento = 0;
  tipoDescuentoCantidad = false;
  cantidadVender: 0;
  hayDatosEnTabla = false;
  tipoCambioMoneda = 0;
  productoEliminar: ProductoFactura;

  // variable que almacena el array de productos que se agregaran al mattable
  productos: ProductoFactura[];

  // variable que contiene los datos de la tabla y las columnas a ser mostradas
  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = ['Producto', 'Marca', 'Modelo', 'Precio', 'Descuento', 'Cantidad', 'TotalCordoba', 'TotalDolar', 'Acciones'];
  productosFactura: MatTableDataSource<ProductoFactura>;


  // variable que emitira el evento para cuando se deba de cerra el modal
  @Output() cerrarModalVentaRapida = new EventEmitter();

  // variables que contendran ya se al usuario o al producto inicial
  @Input() public cliente: Cliente = null;
  @Input() public producto: Producto = null;

  // variable que es de tipo observable del matsort de la tabla
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public servicio: ServicioService,
    public fs: AngularFirestore,
    public db: AngularFireDatabase,
    public ngbModal: NgbModal
  ) {
    if (this.producto == null) {
      this.precioFinal = 0;
    } else {
      this.precioFinal = this.producto.PVenta;
    }
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
    // se verifica de donde fue que se llamo el modal
    if (this.producto == null) {
      this.valordebusquedaCliente = this.cliente.NombreCompleto;
    }

    // se inicializa el matsort de la tabla con los datos existentes
    this.productosFactura.sort = this.sort;

    // se manda a inicializar los datos para los autocomplete de los clientes y vendedores
    this.buscarClientes();
    this.buscarVendedor();
  }

  // funcion para imprimir
  imprimirFactura() {
    // this.nav.mostrarNav = false;
    if ((this.valordebusquedaCliente === '') || (this.valordebusquedaVendedor === '')) {
      this.servicio.newToast(0, 'Error de Facturacion', 'Debe de ingresar un Cliente y un Vendedor');
    } else if (this.productos.length === 0) {
      this.servicio.newToast(0, 'Error de Facturacion', 'Debe de ingresar al menos 1 producto para poder facturarlo');
    } else {
      const tiempo = new Date();
      let totalCantidadComprasCliente = 0;
      let totalComprasActualesCliente = 0;
      this.productos.forEach(producto => {
        totalCantidadComprasCliente += producto.Cantidad;
      });
      // se leen las compras actuales del cliente
      this.fs.doc<Cliente>(`AC Celulares/Control/Clientes/${this.valordebusquedaCliente}`).snapshotChanges()
        .subscribe(cliente => {
          this.totalComprasActualesCliente = cliente.payload.data()['Cantidad de Compras'];
          totalComprasActualesCliente = cliente.payload.data()['Cantidad de Compras'] + totalCantidadComprasCliente;
        });
      // tslint:disable-next-line:max-line-length
      this.fs.doc<HistorialCompra>(`AC Celulares/Control/Clientes/${this.valordebusquedaCliente}/Historial de Compras/${tiempo.getDate()}-${this.meses[tiempo.getMonth()]}-${tiempo.getFullYear()},${tiempo.getHours()}:${tiempo.getMinutes()}:${tiempo.getSeconds()}`)
        .set({
          'Tipo de Pago': 'Efectivo',
          'Total Cordoba': this.totalCordoba(),
          'Total Dolar': this.totalDolar(),
          Hora: tiempo.getHours(),
          Minuto: tiempo.getMinutes(),
          Segundo: tiempo.getSeconds(),
          Dia: tiempo.getDate(),
          Mes: this.meses[tiempo.getMonth()],
          Ano: tiempo.getFullYear(),
          Fecha: `${tiempo.getDate()}-${this.meses[tiempo.getMonth()]}-${tiempo.getFullYear()}`,
          Tiempo: `${tiempo.getHours()}:${tiempo.getMinutes()}:${tiempo.getSeconds()}`,
          // tslint:disable-next-line:max-line-length
          Id: `${tiempo.getDate()}-${this.meses[tiempo.getMonth()]}-${tiempo.getFullYear()},${tiempo.getHours()}:${tiempo.getMinutes()}:${tiempo.getSeconds()}`,
          'Articulos Comprados': this.productos
        }).then((res) => {
          console.log(totalComprasActualesCliente);
          this.fs.doc<Cliente>(`AC Celulares/Control/Clientes/${this.valordebusquedaCliente}`).update({
            'Cantidad de Compras': totalComprasActualesCliente
          }).then(respo => {
            // tslint:disable-next-line:max-line-length
            this.db.database.ref(`AC Celulares/Control/Clientes/${this.valordebusquedaCliente}/Historial de Compras/${tiempo.getDate()}-${this.meses[tiempo.getMonth()]}-${tiempo.getFullYear()},${tiempo.getHours()}:${tiempo.getMinutes()}:${tiempo.getSeconds()}`)
              .set({
                'Tipo de Pago': 'Efectivo',
                'Total Cordoba': this.totalCordoba(),
                'Total Dolar': this.totalDolar(),
                Hora: tiempo.getHours(),
                Minuto: tiempo.getMinutes(),
                Segundo: tiempo.getSeconds(),
                Dia: tiempo.getDate(),
                Mes: this.meses[tiempo.getMonth()],
                Ano: tiempo.getFullYear(),
                Fecha: `${tiempo.getDate()}-${this.meses[tiempo.getMonth()]}-${tiempo.getFullYear()}`,
                Tiempo: `${tiempo.getHours()}:${tiempo.getMinutes()}:${tiempo.getSeconds()}`,
                // tslint:disable-next-line:max-line-length
                Id: `${tiempo.getDate()}-${this.meses[tiempo.getMonth()]}-${tiempo.getFullYear()},${tiempo.getHours()}:${tiempo.getMinutes()}:${tiempo.getSeconds()}`,
                'Articulos Comprados': this.productos
              }).then(resp => {
                this.db.database.ref(`AC Celulares/Control/Clientes/${this.valordebusquedaCliente}`).update({
                  'Cantidad de Compras': totalComprasActualesCliente
                }).then(respon => {
                  // tslint:disable-next-line:max-line-length
                  this.servicio.newToast(1, 'Factura Generada al Cliente Correctamente', 'Se agregaron los productos vendidos al historial del cliente correctamente');
                  this.limpiarTodo();
                });
              });
          });
        }).catch(err => {
          this.servicio.newToast(0, 'Error de Venta', err);
        });
    }
    setTimeout(() => {
      // return xepOnline.Formatter.Format('content', { render: 'download' });
      // window.print();
    }, 1000);
  }

  // funcion que se ejecutara una vez qu la factura se haya pagado
  limpiarTodo() {
    this.valordebusquedaCliente = '';
    this.valordebusquedaVendedor = '';
    this.cantidadVender = 0;
    this.precioFinal = 0;
    this.cantidadCalcularDescuento = 0;
    this.cantidadDescuento = 0;
    this.producto = null;
    this.productos = [];
    this.hayDatosEnTabla = false;
  }

  // funcion que se ejecutara cada vez que el usuario le de click en agregar producto a factura
  agregarProductoFactura() {
    if (this.cantidadVender > this.producto.Existencia) {
      this.servicio.newToast(0, 'Error de Stock', 'La cantidad a vender no puede ser mayor a la cantidad en stock del producto');
    } else if (this.precioFinal < this.producto.PCompra) {
      this.servicio.newToast(0, 'Error de Precio', 'El precio final del producto no puede ser menor al precio de compra del mismo');
    } else if (this.cantidadVender === 0) {
      this.servicio.newToast(0, 'Error de Cantidad', 'Debe de agregar al menos 1 producto en campo "Cantidad"');
    } else if (this.producto == null) {
      this.servicio.newToast(0, 'Error de Insercción', 'Debe de seleccionar un producto antes de agregarlo');
    } else {
      this.fs.doc<Producto>(`AC Celulares/Control/Inventario/${this.servicio.tienda}/Productos/${this.producto.Id}`)
        .update({ Existencia: this.producto.Existencia - this.cantidadVender });
      this.db.database.ref(`AC Celulares/Control/Inventario/${this.servicio.tienda}/Productos/${this.producto.Id}`)
        .update({ Existencia: this.producto.Existencia - this.cantidadVender });
      this.productos.push({
        Id: this.producto.Id,
        Producto: this.producto.Nombre,
        Modelo: this.producto.Modelo,
        Precio: this.producto.PVenta,
        DescuentoPorUnidad: this.cantidadDescuento,
        Cantidad: this.cantidadVender,
        TotalCordoba: this.cantidadVender * this.precioFinal,
        // tslint:disable-next-line:max-line-length
        TotalDolar: Math.round(((this.cantidadVender * this.precioFinal) / this.tipoCambioMoneda) * 100) / 100,
        Marca: this.producto.Marca
      });
      this.productosFactura = new MatTableDataSource(this.productos);
      this.producto = null;
      this.precioFinal = 0;
      this.cantidadVender = 0;
      this.cantidadDescuento = 0;
      // this.servicio.newToast(1, 'Insercción Correcta!', 'El producto se agrego correctamente a la factura');
      this.hayDatosEnTabla = true;
    }
  }

  /** Gets the total cost of all transactions. */
  totalCordoba() {
    return this.productos.map(t => t.TotalCordoba).reduce((acc, value) => acc + value, 0);
  }
  totalDolar() {
    return this.productos.map(t => t.TotalDolar).reduce((acc, value) => acc + value, 0);
  }

  // eliminar producto de la factura
  eliminarProductoFactura() {
    let cantidadAnterior = 0;
    let idProducto: ProductoFactura;
    this.productosFactura.data.forEach((producto, index) => {
      if (this.productoEliminar.Id === producto.Id) {
        idProducto = producto;
        this.productos.splice(index, 1);
        this.productosFactura = new MatTableDataSource(this.productos);
      }
    });
    this.fs.doc<Producto>(`AC Celulares/Control/Inventario/${this.servicio.tienda}/Productos/${idProducto.Id}`).snapshotChanges()
      .subscribe(product => {
        cantidadAnterior = product.payload.data().Existencia;
        console.log(product.payload.data().Existencia);
      });
    console.log(cantidadAnterior);
    setTimeout(() => {
      this.db.database.ref(`AC Celulares/Control/Inventario/${this.servicio.tienda}/Productos/${idProducto.Id}`)
        .update({ Existencia: cantidadAnterior + idProducto.Cantidad });
      this.fs.doc<Producto>(`AC Celulares/Control/Inventario/${this.servicio.tienda}/Productos/${idProducto.Id}`)
        .update({ Existencia: cantidadAnterior + idProducto.Cantidad });
    }, 2000);
  }

  // funcion para cambiar el tipo de descuento
  cambiarTipodescuento() {
    this.tipoDescuentoCantidad = !this.tipoDescuentoCantidad;
    this.cantidadCalcularDescuento = 0;
    this.cantidadDescuento = 0;
  }

  // funcion para vender a precio de compra
  venderAPrecioCompra() {
    if (this.venderPrecioCompra) {
      this.cantidadDescuento = this.producto.PVenta - this.producto.PCompra;
      this.precioFinal = this.producto.PVenta - this.cantidadDescuento;
    } else {
      this.cantidadDescuento = 0;
      this.precioFinal = this.producto.PVenta;
    }
  }

  // funcion para agregar el descuento
  agregarDescuento() {
    this.precioFinal -= this.cantidadDescuento;
  }

  // funcion para cerra el modal
  cerrarModal() {
    this.cerrarModalVentaRapida.emit();
  }

  // funcion para abrir los modales de manera centrada
  openVerticallyCentered(content: string, producto: ProductoFactura) {
    this.productoEliminar = producto;
    this.ngbModal.open(content, { centered: true });
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

  // funcion para calcular el descuento segun su tipo
  calcularDescuento() {
    switch (this.tipoDescuento) {
      case 'porcentaje':
        this.cantidadDescuento = (this.cantidadCalcularDescuento * this.producto.PVenta) / 100;
        break;
      case 'cantidad':
        this.cantidadDescuento = this.cantidadCalcularDescuento;
        break;
      default:
        break;
    }
  }

  // funcion para buscar vendedor
  buscarVendedor() {
    // tslint:disable-next-line:prefer-const
    let self = this;
    self.vendedores = self.fs.collection<Usuario>('AC Celulares/Control/Usuarios', ref => ref
      .orderBy('Nombres')
      .startAt(self.valordebusquedaVendedor.toUpperCase())
      .endAt(self.valordebusquedaVendedor.toUpperCase() + '\uf8ff')
      .limit(10)
    ).valueChanges();
  }
}
