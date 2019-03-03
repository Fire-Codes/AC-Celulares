import { Factura } from './../../interfaces/factura';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';

// importacion del componente del NavSide
import { NavsideComponent } from '../navside/navside.component';

// importacion del componente para imprimir la factura
import { ImprimirFacturaComponent } from '../impresiones/imprimir-factura/imprimir-factura.component';

// importacion del servicio
import { ServicioService } from 'src/app/servicios/servicio.service';

// importacion de las interfaces
import { ProductoFactura } from '../../interfaces/producto-factura';
import { Usuario } from 'src/app/interfaces/usuario';
import { Cliente } from 'src/app/interfaces/cliente';
import { Producto } from 'src/app/interfaces/producto';
import { ControlTienda } from 'src/app/interfaces/control';
import { HistorialCompra } from './../../interfaces/historial-compra';
import { TipoProductos } from 'src/app/interfaces/ventas/tipo-productos';
import { VentasDiarias } from 'src/app/interfaces/ventas/dia/ventas-diarias';

// importacion de los componentes de la base de datos
import { AngularFirestoreCollection, AngularFirestore, Action, DocumentSnapshot } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';

// Importacion del componente para los modales
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-facturar',
  templateUrl: './facturar.component.html',
  styleUrls: ['./facturar.component.scss']
})
export class FacturarComponent implements OnInit {

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

  // variable que contendra las compras actuales del cliente
  totalComprasActualesCliente: number;

  // variable que almacena la cantidad de unidades que se venderan
  cantidadVender = 0;

  // variable que contendra el tipo de a utilizar
  tipoPago = '';

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

  // variable que contendra el total de facturas generadas
  totalFacturas: number;

  // variable que se enviara al componente de imprimir la factura a un dado caso que asi saea
  facturaImprimir: Factura = null;

  // variables que contendra los datos del grafico semanal
  public datosVentasSemanaFirestore: TipoProductos;
  public datosVentasSemanaLocal: TipoProductos;
  public totalVentasSemana = 0;

  // variables que contendran los datos del grafico anual
  public datosVentasAnualFirestore: TipoProductos;
  public datosVentasAnualesLocal: TipoProductos;
  public totalVentasAnual = 0;

  // variables que contendran los datos del grafico diario
  public datosVentasDiarioFirestore: VentasDiarias;
  public datosVentasDiarioLocal: number[];
  public totalVentasDia = 0;

  // variable que contendra los datos del grafico de las ganancias semanales
  public datosGananciasSemanaFirestore: TipoProductos;
  public datosGananciasSemanaLocal: TipoProductos;
  public totalGananciasSemana = 0;

  // variables que contendra los datos del grafico de las ganancias anuales
  public datosGananciasAnualFirestore: TipoProductos;
  public datosGananciasAnualesLocal: TipoProductos;
  public totalGananciasAnual = 0;

  // variables que contendran los datlos del grafico de ganancias diarias
  public datosGananciasDiarioFirestore: VentasDiarias;
  public datosGananciasDiarioLocal: number[];
  public totalGananciasDia = 0;

  constructor(
    public ngbModal: NgbModal,
    public fs: AngularFirestore,
    public servicio: ServicioService,
    public nav: NavsideComponent,
    public db: AngularFireDatabase,
    public factura: ImprimirFacturaComponent
  ) {

    // se define la variable para extraer el tiempo
    const tiempo = new Date();

    // se extraen los datos de firestore de la semana actual para mostrarlo en los graficos correctamente
    // tslint:disable-next-line:max-line-length
    this.fs.doc<TipoProductos>(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana${this.servicio.extraerNumeroSemana()}`)
      .snapshotChanges().subscribe(semana => {
        this.datosVentasSemanaFirestore = semana.payload.data();
        this.datosVentasSemanaLocal = this.datosVentasSemanaFirestore;
        this.totalVentasSemana = semana.payload.data().TotalVentas;
      });

    // se extraen los datos de firestore del mes actual para mostrar en los graficos anuales correctamente
    this.fs.doc<TipoProductos>(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno()}`)
      .snapshotChanges().subscribe(anuales => {
        this.datosVentasAnualFirestore = anuales.payload.data();
        this.datosVentasAnualesLocal = this.datosVentasAnualFirestore;
        this.totalVentasAnual = anuales.payload.data().TotalVentas;
      });

    // se extraen los datos de firestore del dia actual para mostrar en los graficos diarios correctamente
    // tslint:disable-next-line:max-line-length
    this.fs.doc<VentasDiarias>(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Diarias/${this.servicio.extraerAno()}/Datos/${tiempo.getDate()}-${this.servicio.meses[tiempo.getMonth()]}-${tiempo.getFullYear()}`)
      .snapshotChanges().subscribe(diario => {
        this.datosVentasDiarioFirestore = diario.payload.data();
        this.datosVentasDiarioLocal = this.datosVentasDiarioFirestore.Datos;
        this.totalVentasDia = diario.payload.data().TotalVentas;
      });

    // se inicializa la variable de tipo de cambio de moneda
    this.fs.doc('AC Celulares/Control').snapshotChanges()
      .subscribe((control: Action<DocumentSnapshot<ControlTienda>>) => {
        this.tipoCambioMoneda = control.payload.data()['Tipo de Cambio'];
        this.totalFacturas = control.payload.data()['Cantidad Total de Facturas'];
      });

    // se inicializa el array a 0
    this.productos = [];


    // Se asigna el array de productos al contenido de la tabla
    this.productosFactura = new MatTableDataSource(this.productos);
    this.nav.mostrarNav = true;
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
    return this.productos.map(t => t.TotalCordoba).reduce((acc, value) => acc + value, 0);
  }
  totalDolar() {
    return this.productos.map(t => t.TotalDolar).reduce((acc, value) => acc + value, 0);
  }
  totalDescuento() {
    return this.productos.map(t => t.DescuentoPorUnidad).reduce((acc, value) => acc + value, 0);
  }


  // funcion para vender la factura
  imprimirFactura() {
    // this.nav.mostrarNav = false;
    if ((this.valordebusquedaCliente === '') || (this.valordebusquedaVendedor === '')) {
      this.servicio.newToast(0, 'Error de Facturacion', 'Debe de ingresar un Cliente y un Vendedor');
    } else if (this.productos.length === 0) {
      this.servicio.newToast(0, 'Error de Facturacion', 'Debe de ingresar al menos 1 producto para poder facturarlo');
    } else if (this.tipoPago === '') {
      this.servicio.newToast(0, 'Error de Facturacion', 'Debe de Seleccionar el tipo de pago');
    } else {
      const tiempo = new Date();
      let totalCantidadComprasCliente = 0;
      let totalComprasActualesCliente = 0;
      const totalFacturas = this.totalFacturas + 1;
      const interes = this.tipoPago === 'Efectivo' ? 0 : (this.totalCordoba() * 5) / 100;
      let cliente: Cliente;
      let usuario: Usuario;
      this.productos.forEach(producto => {
        totalCantidadComprasCliente += producto.Cantidad;
        switch (producto.Categoria) {
          case 'Accesorio':
            // tslint:disable-next-line:max-line-length
            this.datosVentasDiarioLocal[0] += this.tipoPago === 'Efectivo' ? producto.TotalCordoba : producto.TotalCordoba + ((producto.TotalCordoba * 5) / 100);
            // tslint:disable-next-line:max-line-length
            this.totalVentasDia += this.tipoPago === 'Efectivo' ? producto.TotalCordoba : producto.TotalCordoba + ((producto.TotalCordoba * 5) / 100);
            // tslint:disable-next-line:max-line-length
            this.fs.doc<VentasDiarias>(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Diarias/${this.servicio.extraerAno()}/Datos/${tiempo.getDate()}-${this.servicio.meses[tiempo.getMonth()]}-${tiempo.getFullYear()}`)
              .update({
                Datos: this.datosVentasDiarioLocal,
                TotalVentas: this.totalVentasDia
              }).then(resp => {
                // tslint:disable-next-line:max-line-length
                this.db.database.ref(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Diarias/${this.servicio.extraerAno()}/Datos/${tiempo.getDate()}-${this.servicio.meses[tiempo.getMonth()]}-${tiempo.getFullYear()}`)
                  .update({
                    Datos: this.datosVentasDiarioLocal,
                    TotalVentas: this.totalVentasDia
                  });
              });
            // tslint:disable-next-line:max-line-length
            this.datosVentasSemanaLocal.Accesorios[tiempo.getDay()] += this.tipoPago === 'Efectivo' ? producto.TotalCordoba : producto.TotalCordoba + ((producto.TotalCordoba * 5) / 100);
            // tslint:disable-next-line:max-line-length
            this.totalVentasSemana += this.tipoPago === 'Efectivo' ? producto.TotalCordoba : producto.TotalCordoba + ((producto.TotalCordoba * 5) / 100);

            // se extraen los datos de firestore de la semana actual para mostrarlo en los graficos correctamente
            // tslint:disable-next-line:max-line-length
            this.fs.doc<TipoProductos>(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana${this.servicio.extraerNumeroSemana()}`)
              .update({
                TotalVentas: this.totalVentasSemana,
                Accesorios: this.datosVentasSemanaLocal.Accesorios
              }).then(resp => {
                // tslint:disable-next-line:max-line-length
                this.db.database.ref(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana${this.servicio.extraerNumeroSemana()}`)
                  .update({
                    TotalVentas: this.totalVentasSemana,
                    Accesorios: this.datosVentasSemanaLocal.Accesorios
                  });
              });

            // tslint:disable-next-line:max-line-length
            this.datosVentasAnualesLocal.Accesorios[tiempo.getMonth()] += this.tipoPago === 'Efectivo' ? producto.TotalCordoba : producto.TotalCordoba + ((producto.TotalCordoba * 5) / 100);
            // tslint:disable-next-line:max-line-length
            this.totalVentasAnual += this.tipoPago === 'Efectivo' ? producto.TotalCordoba : producto.TotalCordoba + ((producto.TotalCordoba * 5) / 100);

            // se extraen los datos de firestore del mes actual para mostrar en los graficos anuales correctamente
            this.fs.doc<TipoProductos>(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno()}`)
              .update({
                Accesorios: this.datosVentasAnualesLocal.Accesorios,
                TotalVentas: this.totalVentasAnual
              }).then(resp => {
                this.db.database.ref(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno()}`)
                  .update({
                    Accesorios: this.datosVentasAnualesLocal.Accesorios,
                    TotalVentas: this.totalVentasAnual
                  });
              });
            break;
          case 'Repuesto':
            // tslint:disable-next-line:max-line-length
            this.datosVentasDiarioLocal[1] += this.tipoPago === 'Efectivo' ? producto.TotalCordoba : producto.TotalCordoba + ((producto.TotalCordoba * 5) / 100);
            // tslint:disable-next-line:max-line-length
            this.totalVentasDia += this.tipoPago === 'Efectivo' ? producto.TotalCordoba : producto.TotalCordoba + ((producto.TotalCordoba * 5) / 100);
            // tslint:disable-next-line:max-line-length
            this.fs.doc<VentasDiarias>(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Diarias/${this.servicio.extraerAno()}/Datos/${tiempo.getDate()}-${this.servicio.meses[tiempo.getMonth()]}-${tiempo.getFullYear()}`)
              .update({
                Datos: this.datosVentasDiarioLocal,
                TotalVentas: this.totalVentasDia
              }).then(resp => {
                // tslint:disable-next-line:max-line-length
                this.db.database.ref(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Diarias/${this.servicio.extraerAno()}/Datos/${tiempo.getDate()}-${this.servicio.meses[tiempo.getMonth()]}-${tiempo.getFullYear()}`)
                  .update({
                    Datos: this.datosVentasDiarioLocal,
                    TotalVentas: this.totalVentasDia
                  });
              });
            // tslint:disable-next-line:max-line-length
            this.datosVentasSemanaLocal.Repuestos[tiempo.getDay()] += this.tipoPago === 'Efectivo' ? producto.TotalCordoba : producto.TotalCordoba + ((producto.TotalCordoba * 5) / 100);
            // tslint:disable-next-line:max-line-length
            this.totalVentasSemana += this.tipoPago === 'Efectivo' ? producto.TotalCordoba : producto.TotalCordoba + ((producto.TotalCordoba * 5) / 100);

            // se extraen los datos de firestore de la semana actual para mostrarlo en los graficos correctamente
            // tslint:disable-next-line:max-line-length
            this.fs.doc<TipoProductos>(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana${this.servicio.extraerNumeroSemana()}`)
              .update({
                TotalVentas: this.totalVentasSemana,
                Repuestos: this.datosVentasSemanaLocal.Repuestos
              }).then(resp => {
                // tslint:disable-next-line:max-line-length
                this.db.database.ref(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana${this.servicio.extraerNumeroSemana()}`)
                  .update({
                    TotalVentas: this.totalVentasSemana,
                    Repuestos: this.datosVentasSemanaLocal.Repuestos
                  });
              });

            // tslint:disable-next-line:max-line-length
            this.datosVentasAnualesLocal.Repuestos[tiempo.getMonth()] += this.tipoPago === 'Efectivo' ? producto.TotalCordoba : producto.TotalCordoba + ((producto.TotalCordoba * 5) / 100);
            // tslint:disable-next-line:max-line-length
            this.totalVentasAnual += this.tipoPago === 'Efectivo' ? producto.TotalCordoba : producto.TotalCordoba + ((producto.TotalCordoba * 5) / 100);

            // se extraen los datos de firestore del mes actual para mostrar en los graficos anuales correctamente
            this.fs.doc<TipoProductos>(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno()}`)
              .update({
                Repuestos: this.datosVentasAnualesLocal.Repuestos,
                TotalVentas: this.totalVentasAnual
              }).then(resp => {
                this.db.database.ref(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno()}`)
                  .update({
                    Repuestos: this.datosVentasAnualesLocal.Repuestos,
                    TotalVentas: this.totalVentasAnual
                  });
              });
            break;
          case 'Celular':
            // tslint:disable-next-line:max-line-length
            this.datosVentasDiarioLocal[2] += this.tipoPago === 'Efectivo' ? producto.TotalCordoba : producto.TotalCordoba + ((producto.TotalCordoba * 5) / 100);
            // tslint:disable-next-line:max-line-length
            this.totalVentasDia += this.tipoPago === 'Efectivo' ? producto.TotalCordoba : producto.TotalCordoba + ((producto.TotalCordoba * 5) / 100);
            // tslint:disable-next-line:max-line-length
            this.fs.doc<VentasDiarias>(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Diarias/${this.servicio.extraerAno()}/Datos/${tiempo.getDate()}-${this.servicio.meses[tiempo.getMonth()]}-${tiempo.getFullYear()}`)
              .update({
                Datos: this.datosVentasDiarioLocal,
                TotalVentas: this.totalVentasDia
              }).then(resp => {
                // tslint:disable-next-line:max-line-length
                this.db.database.ref(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Diarias/${this.servicio.extraerAno()}/Datos/${tiempo.getDate()}-${this.servicio.meses[tiempo.getMonth()]}-${tiempo.getFullYear()}`)
                  .update({
                    Datos: this.datosVentasDiarioLocal,
                    TotalVentas: this.totalVentasDia
                  });
              });
            // tslint:disable-next-line:max-line-length
            this.datosVentasSemanaLocal.Celulares[tiempo.getDay()] += this.tipoPago === 'Efectivo' ? producto.TotalCordoba : producto.TotalCordoba + ((producto.TotalCordoba * 5) / 100);
            // tslint:disable-next-line:max-line-length
            this.totalVentasSemana += this.tipoPago === 'Efectivo' ? producto.TotalCordoba : producto.TotalCordoba + ((producto.TotalCordoba * 5) / 100);

            // se extraen los datos de firestore de la semana actual para mostrarlo en los graficos correctamente
            // tslint:disable-next-line:max-line-length
            this.fs.doc<TipoProductos>(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana${this.servicio.extraerNumeroSemana()}`)
              .update({
                TotalVentas: this.totalVentasSemana,
                Celulares: this.datosVentasSemanaLocal.Celulares
              }).then(resp => {
                // tslint:disable-next-line:max-line-length
                this.db.database.ref(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana${this.servicio.extraerNumeroSemana()}`)
                  .update({
                    TotalVentas: this.totalVentasSemana,
                    Celulares: this.datosVentasSemanaLocal.Celulares
                  });
              });

            // tslint:disable-next-line:max-line-length
            this.datosVentasAnualesLocal.Celulares[tiempo.getMonth()] += this.tipoPago === 'Efectivo' ? producto.TotalCordoba : producto.TotalCordoba + ((producto.TotalCordoba * 5) / 100);
            // tslint:disable-next-line:max-line-length
            this.totalVentasAnual += this.tipoPago === 'Efectivo' ? producto.TotalCordoba : producto.TotalCordoba + ((producto.TotalCordoba * 5) / 100);

            // se extraen los datos de firestore del mes actual para mostrar en los graficos anuales correctamente
            this.fs.doc<TipoProductos>(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno()}`)
              .update({
                Celulares: this.datosVentasAnualesLocal.Celulares,
                TotalVentas: this.totalVentasAnual
              }).then(resp => {
                this.db.database.ref(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno()}`)
                  .update({
                    Celulares: this.datosVentasAnualesLocal.Celulares,
                    TotalVentas: this.totalVentasAnual
                  });
              });
            break;
          case 'Herramienta':
            // tslint:disable-next-line:max-line-length
            this.datosVentasDiarioLocal[4] += this.tipoPago === 'Efectivo' ? producto.TotalCordoba : producto.TotalCordoba + ((producto.TotalCordoba * 5) / 100);
            // tslint:disable-next-line:max-line-length
            this.totalVentasDia += this.tipoPago === 'Efectivo' ? producto.TotalCordoba : producto.TotalCordoba + ((producto.TotalCordoba * 5) / 100);
            // tslint:disable-next-line:max-line-length
            this.fs.doc<VentasDiarias>(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Diarias/${this.servicio.extraerAno()}/Datos/${tiempo.getDate()}-${this.servicio.meses[tiempo.getMonth()]}-${tiempo.getFullYear()}`)
              .update({
                Datos: this.datosVentasDiarioLocal,
                TotalVentas: this.totalVentasDia
              }).then(resp => {
                // tslint:disable-next-line:max-line-length
                this.db.database.ref(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Diarias/${this.servicio.extraerAno()}/Datos/${tiempo.getDate()}-${this.servicio.meses[tiempo.getMonth()]}-${tiempo.getFullYear()}`)
                  .update({
                    Datos: this.datosVentasDiarioLocal,
                    TotalVentas: this.totalVentasDia
                  });
              });
            // tslint:disable-next-line:max-line-length
            this.datosVentasSemanaLocal.Herramientas[tiempo.getDay()] += this.tipoPago === 'Efectivo' ? producto.TotalCordoba : producto.TotalCordoba + ((producto.TotalCordoba * 5) / 100);
            // tslint:disable-next-line:max-line-length
            this.totalVentasSemana += this.tipoPago === 'Efectivo' ? producto.TotalCordoba : producto.TotalCordoba + ((producto.TotalCordoba * 5) / 100);

            // se extraen los datos de firestore de la semana actual para mostrarlo en los graficos correctamente
            // tslint:disable-next-line:max-line-length
            this.fs.doc<TipoProductos>(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana${this.servicio.extraerNumeroSemana()}`)
              .update({
                TotalVentas: this.totalVentasSemana,
                Herramientas: this.datosVentasSemanaLocal.Herramientas
              }).then(resp => {
                // tslint:disable-next-line:max-line-length
                this.db.database.ref(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana${this.servicio.extraerNumeroSemana()}`)
                  .update({
                    TotalVentas: this.totalVentasSemana,
                    Herramientas: this.datosVentasSemanaLocal.Herramientas
                  });
              });

            // tslint:disable-next-line:max-line-length
            this.datosVentasAnualesLocal.Herramientas[tiempo.getMonth()] += this.tipoPago === 'Efectivo' ? producto.TotalCordoba : producto.TotalCordoba + ((producto.TotalCordoba * 5) / 100);
            // tslint:disable-next-line:max-line-length
            this.totalVentasAnual += this.tipoPago === 'Efectivo' ? producto.TotalCordoba : producto.TotalCordoba + ((producto.TotalCordoba * 5) / 100);

            // se extraen los datos de firestore del mes actual para mostrar en los graficos anuales correctamente
            this.fs.doc<TipoProductos>(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno()}`)
              .update({
                Herramientas: this.datosVentasAnualesLocal.Herramientas,
                TotalVentas: this.totalVentasAnual
              }).then(resp => {
                this.db.database.ref(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno()}`)
                  .update({
                    Herramientas: this.datosVentasAnualesLocal.Herramientas,
                    TotalVentas: this.totalVentasAnual
                  });
              });
            break;
          default:
            break;
        }
      });
      // se leen las compras actuales del cliente
      this.fs.doc<Cliente>(`AC Celulares/Control/Clientes/${this.valordebusquedaCliente}`).snapshotChanges()
        .subscribe(clientes => {
          this.totalComprasActualesCliente = clientes.payload.data()['Cantidad de Compras'];
          totalComprasActualesCliente = clientes.payload.data()['Cantidad de Compras'] + totalCantidadComprasCliente;
          cliente = clientes.payload.data();
        });
      this.fs.doc<Usuario>(`AC Celulares/Control/Usuarios/${this.valordebusquedaVendedor}`).snapshotChanges()
        .subscribe(usuarios => {
          usuario = usuarios.payload.data();
        });
      // tslint:disable-next-line:max-line-length
      this.fs.doc<HistorialCompra>(`AC Celulares/Control/Clientes/${this.valordebusquedaCliente}/Historial de Compras/${tiempo.getDate()}-${this.meses[tiempo.getMonth()]}-${tiempo.getFullYear()},${tiempo.getHours()}:${tiempo.getMinutes()}:${tiempo.getSeconds()}`)
        .set({
          'Tipo de Pago': this.tipoPago,
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
          'Articulos Comprados': this.productos,
          Interes: interes
        }).then((res) => {
          this.servicio.facturaImprimir = {
            Productos: this.productos,
            Cliente: cliente,
            Vendedor: usuario,
            Hora: tiempo.getHours(),
            Minuto: tiempo.getMinutes(),
            Segundo: tiempo.getSeconds(),
            Dia: tiempo.getDate(),
            Mes: tiempo.getMonth(),
            Ano: tiempo.getFullYear(),
            Fecha: `${tiempo.getDate()}-${this.meses[tiempo.getMonth()]}-${tiempo.getFullYear()}`,
            Tiempo: `${tiempo.getHours()}:${tiempo.getMinutes()}:${tiempo.getSeconds()}`,
            Id: `FAC${totalFacturas}`,
            NumeroFactura: totalFacturas,
            TotalCordoba: this.totalCordoba(),
            TotalDolar: this.totalDolar(),
            Descuento: this.totalDescuento(),
            Interes: interes,
            TipoPago: this.tipoPago
          };
          console.log(totalComprasActualesCliente);
          this.fs.doc<Factura>(`AC Celulares/Control/Facturas/${this.servicio.tienda}/Historial de Facturas/FAC${totalFacturas}`).set({
            Productos: this.productos,
            Cliente: cliente,
            Vendedor: usuario,
            Hora: tiempo.getHours(),
            Minuto: tiempo.getMinutes(),
            Segundo: tiempo.getSeconds(),
            Dia: tiempo.getDate(),
            Mes: tiempo.getMonth(),
            Ano: tiempo.getFullYear(),
            Fecha: `${tiempo.getDate()}-${this.meses[tiempo.getMonth()]}-${tiempo.getFullYear()}`,
            Tiempo: `${tiempo.getHours()}:${tiempo.getMinutes()}:${tiempo.getSeconds()}`,
            Id: `FAC${totalFacturas}`,
            NumeroFactura: totalFacturas,
            TotalCordoba: this.totalCordoba(),
            TotalDolar: this.totalDolar(),
            Descuento: this.totalDescuento(),
            Interes: interes,
            TipoPago: this.tipoPago
          }).then(respn => {
            this.fs.doc<ControlTienda>('AC Celulares/Control').update({
              'Cantidad Total de Facturas': totalFacturas
            });
          });
          this.fs.doc<Cliente>(`AC Celulares/Control/Clientes/${this.valordebusquedaCliente}`).update({
            'Cantidad de Compras': totalComprasActualesCliente
          }).then(respo => {
            // tslint:disable-next-line:max-line-length
            this.db.database.ref(`AC Celulares/Control/Clientes/${this.valordebusquedaCliente}/Historial de Compras/${tiempo.getDate()}-${this.meses[tiempo.getMonth()]}-${tiempo.getFullYear()},${tiempo.getHours()}:${tiempo.getMinutes()}:${tiempo.getSeconds()}`)
              .set({
                'Tipo de Pago': this.tipoPago,
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
                'Articulos Comprados': this.productos,
                Interes: interes
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
  }

  // funcion para redireccionar a imprimir las facturas
  imprimirFacturass() {
    setTimeout(() => {
      this.servicio.navegar('imprimirFactura');
    }, 2000);
  }

  // funcion que se ejecutara una vez qu la factura se haya pagado
  limpiarTodo() {
    this.valordebusquedaCliente = '';
    this.valordebusquedaVendedor = '';
    this.cantidadVender = 0;
    this.precioFinal = 0;
    this.cantidadCalcularDescuento = 0;
    this.tipoPago = '';
    this.cantidadDescuento = 0;
    this.productoSeleccionado = null;
    this.productos = [];
    this.hayDatosEnTabla = false;
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
      this.fs.doc<Producto>(`AC Celulares/Control/Inventario/${this.servicio.tienda}/Productos/${this.productoSeleccionado.Id}`)
        .update({ Existencia: this.productoSeleccionado.Existencia - this.cantidadVender });
      this.db.database.ref(`AC Celulares/Control/Inventario/${this.servicio.tienda}/Productos/${this.productoSeleccionado.Id}`)
        .update({ Existencia: this.productoSeleccionado.Existencia - this.cantidadVender });
      this.productos.push({
        Id: this.productoSeleccionado.Id,
        Producto: this.productoSeleccionado.Nombre,
        Modelo: this.productoSeleccionado.Modelo,
        Precio: this.productoSeleccionado.PVenta,
        DescuentoPorUnidad: this.cantidadDescuento,
        Cantidad: this.cantidadVender,
        TotalCordoba: this.cantidadVender * this.precioFinal,
        // tslint:disable-next-line:max-line-length
        TotalDolar: Math.round(((this.cantidadVender * this.precioFinal) / this.tipoCambioMoneda) * 100) / 100,
        Marca: this.productoSeleccionado.Marca,
        Categoria: this.productoSeleccionado.Categoria
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
