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

// se importa el componente de matsort y mattabledatasource
import { MatTableDataSource, MatSort } from '@angular/material';

// se importa el componente de factura
import { FacturarComponent } from './../../facturar/facturar.component';

// se importa el componente para imprimir factura
import { ImprimirFacturaComponent } from '../../impresiones/imprimir-factura/imprimir-factura.component';

// se importa el componente para seleccionar los productos
import { SeleccionarProductoComponent } from '../seleccionar-producto/seleccionar-producto.component';

// se importan las interfaces
import { TipoProductos } from 'src/app/interfaces/ventas/tipo-productos';
import { VentasDiarias } from 'src/app/interfaces/ventas/dia/ventas-diarias';
import { ControlTienda } from 'src/app/interfaces/control';
import { HistorialCompra } from 'src/app/interfaces/historial-compra';
import { Factura } from 'src/app/interfaces/factura';

// importacion de los componentes de la base de datos
import { AngularFirestore, Action, DocumentSnapshot } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';




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

  // variable que contendra el tipo de pago a realizar
  tipoPago = '';

  // variable que contiene los datos de la tabla y las columnas a ser mostradas
  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = ['Producto', 'Modelo', 'Precio', 'Descuento', 'Cantidad', 'TotalCordoba', 'TotalDolar', 'Acciones'];
  productosFactura: MatTableDataSource<ProductoFactura>;


  // variable que emitira el evento para cuando se deba de cerra el modal
  @Output() cerrarModalVentaRapida = new EventEmitter();

  // variables que contendran ya se al usuario o al producto inicial
  @Input() public cliente: Cliente = null;
  @Input() public producto: Producto = null;

  // variable que es de tipo observable del matsort de la tabla
  @ViewChild(MatSort) sort: MatSort;
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
    public servicio: ServicioService,
    public fs: AngularFirestore,
    public db: AngularFireDatabase,
    public ngbModal: NgbModal,
    public factura: ImprimirFacturaComponent
  ) {

    // se define la variable para extraer el tiempo
    const tiempo = new Date();

    // se extraen los datos de firestore de la semana actual para mostrarlo en los graficos correctamente para las ventas
    // tslint:disable-next-line:max-line-length
    this.fs.doc<TipoProductos>(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana${this.servicio.extraerNumeroSemana()}`)
      .snapshotChanges().subscribe(semana => {
        this.datosVentasSemanaFirestore = semana.payload.data();
        this.datosVentasSemanaLocal = this.datosVentasSemanaFirestore;
        this.totalVentasSemana = semana.payload.data().TotalVentas;
      });

    // se extraen los datos de firestore del mes actual para mostrar en los graficos anuales correctamente para las ventas
    this.fs.doc<TipoProductos>(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno()}`)
      .snapshotChanges().subscribe(anuales => {
        this.datosVentasAnualFirestore = anuales.payload.data();
        this.datosVentasAnualesLocal = this.datosVentasAnualFirestore;
        this.totalVentasAnual = anuales.payload.data().TotalVentas;
      });

    // se extraen los datos de firestore del dia actual para mostrar en los graficos diarios correctamente para las ventas
    // tslint:disable-next-line:max-line-length
    this.fs.doc<VentasDiarias>(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Diarias/${this.servicio.extraerAno()}/Datos/${tiempo.getDate()}-${this.servicio.meses[tiempo.getMonth()]}-${tiempo.getFullYear()}`)
      .snapshotChanges().subscribe(diario => {
        this.datosVentasDiarioFirestore = diario.payload.data();
        this.datosVentasDiarioLocal = this.datosVentasDiarioFirestore.Datos;
        this.totalVentasDia = diario.payload.data().TotalVentas;
      });

    // se extraen los datos de firestore de la semana actual para mostrarlo en los graficos correctamente para las ganancias
    // tslint:disable-next-line:max-line-length
    this.fs.doc<TipoProductos>(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana${this.servicio.extraerNumeroSemana()}`)
      .snapshotChanges().subscribe(semana => {
        this.datosGananciasSemanaFirestore = semana.payload.data();
        this.datosGananciasSemanaLocal = this.datosGananciasSemanaFirestore;
        this.totalGananciasSemana = semana.payload.data().TotalVentas;
      });

    // se extraen los datos de firestore del mes actual para mostrar en los graficos anuales correctamente para las ganancias
    this.fs.doc<TipoProductos>(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno()}`)
      .snapshotChanges().subscribe(anuales => {
        this.datosGananciasAnualFirestore = anuales.payload.data();
        this.datosGananciasAnualesLocal = this.datosGananciasAnualFirestore;
        this.totalGananciasAnual = anuales.payload.data().TotalVentas;
      });

    // se extraen los datos de firestore del dia actual para mostrar en los graficos diarios correctamente para las ganancias
    // tslint:disable-next-line:max-line-length
    this.fs.doc<VentasDiarias>(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Diarias/${this.servicio.extraerAno()}/Datos/${tiempo.getDate()}-${this.servicio.meses[tiempo.getMonth()]}-${tiempo.getFullYear()}`)
      .snapshotChanges().subscribe(diario => {
        this.datosGananciasDiarioFirestore = diario.payload.data();
        this.datosGananciasDiarioLocal = this.datosGananciasDiarioFirestore.Datos;
        this.totalGananciasDia = diario.payload.data().TotalVentas;
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
  }

  ngOnInit() {
    if (this.producto == null) {
      this.precioFinal = 0;
    } else {
      this.precioFinal = this.producto.PVenta;
    }
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
    } else if (this.tipoPago === '') {
      this.servicio.newToast(0, 'Error de Facturacion', 'Debe de Seleccionar el tipo de pago');
    } else {
      const tiempo = new Date();
      let totalCantidadComprasCliente = 0;
      let totalComprasActualesCliente = 0;
      const interes = this.tipoPago === 'Efectivo' ? 0 : (this.totalCordoba() * 5) / 100;
      const totalFacturas = this.totalFacturas + 1;
      let cliente: Cliente;
      let usuario: Usuario;
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
      this.productos.forEach(producto => {
        totalCantidadComprasCliente += producto.Cantidad;
        switch (producto.Categoria) {
          case 'Accesorio':

            // para las ventas
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

            // para las ganancias
            // tslint:disable-next-line:max-line-length
            this.datosGananciasDiarioLocal[0] += this.tipoPago === 'Efectivo' ? producto.PVenta - producto.PCompra : (producto.PVenta - producto.PCompra) + ((producto.TotalCordoba * 5) / 100);
            // tslint:disable-next-line:max-line-length
            this.totalGananciasDia += this.tipoPago === 'Efectivo' ? producto.PVenta - producto.PCompra : (producto.PVenta - producto.PCompra) + ((producto.TotalCordoba * 5) / 100);
            // tslint:disable-next-line:max-line-length
            this.fs.doc<VentasDiarias>(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Diarias/${this.servicio.extraerAno()}/Datos/${tiempo.getDate()}-${this.servicio.meses[tiempo.getMonth()]}-${tiempo.getFullYear()}`)
              .update({
                Datos: this.datosGananciasDiarioLocal,
                TotalVentas: this.totalGananciasDia
              }).then(resp => {
                // tslint:disable-next-line:max-line-length
                this.db.database.ref(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Diarias/${this.servicio.extraerAno()}/Datos/${tiempo.getDate()}-${this.servicio.meses[tiempo.getMonth()]}-${tiempo.getFullYear()}`)
                  .update({
                    Datos: this.datosGananciasDiarioLocal,
                    TotalVentas: this.totalGananciasDia
                  });
              });
            // tslint:disable-next-line:max-line-length
            this.datosGananciasSemanaLocal.Accesorios[tiempo.getDay()] += this.tipoPago === 'Efectivo' ? producto.PVenta - producto.PCompra : (producto.PVenta - producto.PCompra) + ((producto.TotalCordoba * 5) / 100);
            // tslint:disable-next-line:max-line-length
            this.totalGananciasSemana += this.tipoPago === 'Efectivo' ? producto.PVenta - producto.PCompra : (producto.PVenta - producto.PCompra) + ((producto.TotalCordoba * 5) / 100);

            // se extraen los datos de firestore de la semana actual para mostrarlo en los graficos correctamente
            // tslint:disable-next-line:max-line-length
            this.fs.doc<TipoProductos>(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana${this.servicio.extraerNumeroSemana()}`)
              .update({
                TotalVentas: this.totalGananciasSemana,
                Accesorios: this.datosGananciasSemanaLocal.Accesorios
              }).then(resp => {
                // tslint:disable-next-line:max-line-length
                this.db.database.ref(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana${this.servicio.extraerNumeroSemana()}`)
                  .update({
                    TotalVentas: this.totalGananciasSemana,
                    Accesorios: this.datosGananciasSemanaLocal.Accesorios
                  });
              });

            // tslint:disable-next-line:max-line-length
            this.datosGananciasAnualesLocal.Accesorios[tiempo.getMonth()] += this.tipoPago === 'Efectivo' ? producto.PVenta - producto.PCompra : (producto.PVenta - producto.PCompra) + ((producto.TotalCordoba * 5) / 100);
            // tslint:disable-next-line:max-line-length
            this.totalGananciasAnual += this.tipoPago === 'Efectivo' ? producto.PVenta - producto.PCompra : (producto.PVenta - producto.PCompra) + ((producto.TotalCordoba * 5) / 100);

            // se extraen los datos de firestore del mes actual para mostrar en los graficos anuales correctamente
            this.fs.doc<TipoProductos>(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno()}`)
              .update({
                Accesorios: this.datosGananciasAnualesLocal.Accesorios,
                TotalVentas: this.totalGananciasAnual
              }).then(resp => {
                this.db.database.ref(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno()}`)
                  .update({
                    Accesorios: this.datosGananciasAnualesLocal.Accesorios,
                    TotalVentas: this.totalGananciasAnual
                  });
              });
            break;
          case 'Repuesto':

            // para las ventas
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

            // para las ganancias
            // tslint:disable-next-line:max-line-length
            this.datosGananciasDiarioLocal[1] += this.tipoPago === 'Efectivo' ? producto.PVenta - producto.PCompra : (producto.PVenta - producto.PCompra) + ((producto.TotalCordoba * 5) / 100);
            // tslint:disable-next-line:max-line-length
            this.totalGananciasDia += this.tipoPago === 'Efectivo' ? producto.PVenta - producto.PCompra : (producto.PVenta - producto.PCompra) + ((producto.TotalCordoba * 5) / 100);
            // tslint:disable-next-line:max-line-length
            this.fs.doc<VentasDiarias>(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Diarias/${this.servicio.extraerAno()}/Datos/${tiempo.getDate()}-${this.servicio.meses[tiempo.getMonth()]}-${tiempo.getFullYear()}`)
              .update({
                Datos: this.datosGananciasDiarioLocal,
                TotalVentas: this.totalGananciasDia
              }).then(resp => {
                // tslint:disable-next-line:max-line-length
                this.db.database.ref(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Diarias/${this.servicio.extraerAno()}/Datos/${tiempo.getDate()}-${this.servicio.meses[tiempo.getMonth()]}-${tiempo.getFullYear()}`)
                  .update({
                    Datos: this.datosGananciasDiarioLocal,
                    TotalVentas: this.totalGananciasDia
                  });
              });
            // tslint:disable-next-line:max-line-length
            this.datosGananciasSemanaLocal.Repuestos[tiempo.getDay()] += this.tipoPago === 'Efectivo' ? producto.PVenta - producto.PCompra : (producto.PVenta - producto.PCompra) + ((producto.TotalCordoba * 5) / 100);
            // tslint:disable-next-line:max-line-length
            this.totalGananciasSemana += this.tipoPago === 'Efectivo' ? producto.PVenta - producto.PCompra : (producto.PVenta - producto.PCompra) + ((producto.TotalCordoba * 5) / 100);

            // se extraen los datos de firestore de la semana actual para mostrarlo en los graficos correctamente
            // tslint:disable-next-line:max-line-length
            this.fs.doc<TipoProductos>(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana${this.servicio.extraerNumeroSemana()}`)
              .update({
                TotalVentas: this.totalGananciasSemana,
                Repuestos: this.datosGananciasSemanaLocal.Repuestos
              }).then(resp => {
                // tslint:disable-next-line:max-line-length
                this.db.database.ref(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana${this.servicio.extraerNumeroSemana()}`)
                  .update({
                    TotalVentas: this.totalGananciasSemana,
                    Repuestos: this.datosGananciasSemanaLocal.Repuestos
                  });
              });

            // tslint:disable-next-line:max-line-length
            this.datosGananciasAnualesLocal.Repuestos[tiempo.getMonth()] += this.tipoPago === 'Efectivo' ? producto.PVenta - producto.PCompra : (producto.PVenta - producto.PCompra) + ((producto.TotalCordoba * 5) / 100);
            // tslint:disable-next-line:max-line-length
            this.totalGananciasAnual += this.tipoPago === 'Efectivo' ? producto.PVenta - producto.PCompra : (producto.PVenta - producto.PCompra) + ((producto.TotalCordoba * 5) / 100);

            // se extraen los datos de firestore del mes actual para mostrar en los graficos anuales correctamente
            this.fs.doc<TipoProductos>(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno()}`)
              .update({
                Repuestos: this.datosGananciasAnualesLocal.Repuestos,
                TotalVentas: this.totalGananciasAnual
              }).then(resp => {
                this.db.database.ref(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno()}`)
                  .update({
                    Repuestos: this.datosGananciasAnualesLocal.Repuestos,
                    TotalVentas: this.totalGananciasAnual
                  });
              });
            break;
          case 'Celular':

            // para las ventas
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

            // para las ganancias
            // tslint:disable-next-line:max-line-length
            this.datosGananciasDiarioLocal[2] += this.tipoPago === 'Efectivo' ? producto.PVenta - producto.PCompra : (producto.PVenta - producto.PCompra) + ((producto.TotalCordoba * 5) / 100);
            // tslint:disable-next-line:max-line-length
            this.totalGananciasDia += this.tipoPago === 'Efectivo' ? producto.PVenta - producto.PCompra : (producto.PVenta - producto.PCompra) + ((producto.TotalCordoba * 5) / 100);
            // tslint:disable-next-line:max-line-length
            this.fs.doc<VentasDiarias>(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Diarias/${this.servicio.extraerAno()}/Datos/${tiempo.getDate()}-${this.servicio.meses[tiempo.getMonth()]}-${tiempo.getFullYear()}`)
              .update({
                Datos: this.datosGananciasDiarioLocal,
                TotalVentas: this.totalGananciasDia
              }).then(resp => {
                // tslint:disable-next-line:max-line-length
                this.db.database.ref(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Diarias/${this.servicio.extraerAno()}/Datos/${tiempo.getDate()}-${this.servicio.meses[tiempo.getMonth()]}-${tiempo.getFullYear()}`)
                  .update({
                    Datos: this.datosGananciasDiarioLocal,
                    TotalVentas: this.totalGananciasDia
                  });
              });
            // tslint:disable-next-line:max-line-length
            this.datosGananciasSemanaLocal.Celulares[tiempo.getDay()] += this.tipoPago === 'Efectivo' ? producto.PVenta - producto.PCompra : (producto.PVenta - producto.PCompra) + ((producto.TotalCordoba * 5) / 100);
            // tslint:disable-next-line:max-line-length
            this.totalGananciasSemana += this.tipoPago === 'Efectivo' ? producto.PVenta - producto.PCompra : (producto.PVenta - producto.PCompra) + ((producto.TotalCordoba * 5) / 100);

            // se extraen los datos de firestore de la semana actual para mostrarlo en los graficos correctamente
            // tslint:disable-next-line:max-line-length
            this.fs.doc<TipoProductos>(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana${this.servicio.extraerNumeroSemana()}`)
              .update({
                TotalVentas: this.totalGananciasSemana,
                Celulares: this.datosGananciasSemanaLocal.Celulares
              }).then(resp => {
                // tslint:disable-next-line:max-line-length
                this.db.database.ref(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana${this.servicio.extraerNumeroSemana()}`)
                  .update({
                    TotalVentas: this.totalGananciasSemana,
                    Celulares: this.datosGananciasSemanaLocal.Celulares
                  });
              });

            // tslint:disable-next-line:max-line-length
            this.datosGananciasAnualesLocal.Celulares[tiempo.getMonth()] += this.tipoPago === 'Efectivo' ? producto.PVenta - producto.PCompra : (producto.PVenta - producto.PCompra) + ((producto.TotalCordoba * 5) / 100);
            // tslint:disable-next-line:max-line-length
            this.totalGananciasAnual += this.tipoPago === 'Efectivo' ? producto.PVenta - producto.PCompra : (producto.PVenta - producto.PCompra) + ((producto.TotalCordoba * 5) / 100);

            // se extraen los datos de firestore del mes actual para mostrar en los graficos anuales correctamente
            this.fs.doc<TipoProductos>(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno()}`)
              .update({
                Celulares: this.datosGananciasAnualesLocal.Celulares,
                TotalVentas: this.totalGananciasAnual
              }).then(resp => {
                this.db.database.ref(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno()}`)
                  .update({
                    Celulares: this.datosGananciasAnualesLocal.Celulares,
                    TotalVentas: this.totalGananciasAnual
                  });
              });
            break;
          case 'Herramienta':

            // para las ventas
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

            // para las ganancias
            // tslint:disable-next-line:max-line-length
            this.datosGananciasDiarioLocal[4] += this.tipoPago === 'Efectivo' ? producto.PVenta - producto.PCompra : (producto.PVenta - producto.PCompra) + ((producto.TotalCordoba * 5) / 100);
            // tslint:disable-next-line:max-line-length
            this.totalGananciasDia += this.tipoPago === 'Efectivo' ? producto.PVenta - producto.PCompra : (producto.PVenta - producto.PCompra) + ((producto.TotalCordoba * 5) / 100);
            // tslint:disable-next-line:max-line-length
            this.fs.doc<VentasDiarias>(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Diarias/${this.servicio.extraerAno()}/Datos/${tiempo.getDate()}-${this.servicio.meses[tiempo.getMonth()]}-${tiempo.getFullYear()}`)
              .update({
                Datos: this.datosGananciasDiarioLocal,
                TotalVentas: this.totalGananciasDia
              }).then(resp => {
                // tslint:disable-next-line:max-line-length
                this.db.database.ref(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Diarias/${this.servicio.extraerAno()}/Datos/${tiempo.getDate()}-${this.servicio.meses[tiempo.getMonth()]}-${tiempo.getFullYear()}`)
                  .update({
                    Datos: this.datosGananciasDiarioLocal,
                    TotalVentas: this.totalGananciasDia
                  });
              });
            // tslint:disable-next-line:max-line-length
            this.datosGananciasSemanaLocal.Herramientas[tiempo.getDay()] += this.tipoPago === 'Efectivo' ? producto.PVenta - producto.PCompra : (producto.PVenta - producto.PCompra) + ((producto.TotalCordoba * 5) / 100);
            // tslint:disable-next-line:max-line-length
            this.totalGananciasSemana += this.tipoPago === 'Efectivo' ? producto.PVenta - producto.PCompra : (producto.PVenta - producto.PCompra) + ((producto.TotalCordoba * 5) / 100);

            // se extraen los datos de firestore de la semana actual para mostrarlo en los graficos correctamente
            // tslint:disable-next-line:max-line-length
            this.fs.doc<TipoProductos>(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana${this.servicio.extraerNumeroSemana()}`)
              .update({
                TotalVentas: this.totalGananciasSemana,
                Herramientas: this.datosGananciasSemanaLocal.Herramientas
              }).then(resp => {
                // tslint:disable-next-line:max-line-length
                this.db.database.ref(`AC Celulares/Control/Gananacias/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana${this.servicio.extraerNumeroSemana()}`)
                  .update({
                    TotalVentas: this.totalGananciasSemana,
                    Herramientas: this.datosGananciasSemanaLocal.Herramientas
                  });
              });

            // tslint:disable-next-line:max-line-length
            this.datosGananciasAnualesLocal.Herramientas[tiempo.getMonth()] += this.tipoPago === 'Efectivo' ? producto.PVenta - producto.PCompra : (producto.PVenta - producto.PCompra) + ((producto.TotalCordoba * 5) / 100);
            // tslint:disable-next-line:max-line-length
            this.totalGananciasAnual += this.tipoPago === 'Efectivo' ? producto.PVenta - producto.PCompra : (producto.PVenta - producto.PCompra) + ((producto.TotalCordoba * 5) / 100);

            // se extraen los datos de firestore del mes actual para mostrar en los graficos anuales correctamente
            this.fs.doc<TipoProductos>(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno()}`)
              .update({
                Herramientas: this.datosGananciasAnualesLocal.Herramientas,
                TotalVentas: this.totalGananciasAnual
              }).then(resp => {
                this.db.database.ref(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno()}`)
                  .update({
                    Herramientas: this.datosGananciasAnualesLocal.Herramientas,
                    TotalVentas: this.totalGananciasAnual
                  });
              });
            break;
          default:
            break;
        }
      });
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
      // tslint:disable-next-line:max-line-length
      this.fs.doc<HistorialCompra>(`AC Celulares/Control/Clientes/${this.valordebusquedaCliente}/Historial de Compras/${tiempo.getDate()}-${this.meses[tiempo.getMonth()]}-${tiempo.getFullYear()},${tiempo.getHours()}:${tiempo.getMinutes()}:${tiempo.getSeconds()}`)
        .set({
          TipoPago: this.tipoPago,
          TotalCordoba: this.totalCordoba(),
          TotalDolar: this.totalDolar(),
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
          console.log(totalComprasActualesCliente);
          this.fs.doc<Cliente>(`AC Celulares/Control/Clientes/${this.valordebusquedaCliente}`).update({
            'Cantidad de Compras': totalComprasActualesCliente
          }).then(respo => {
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
            // tslint:disable-next-line:max-line-length
            this.db.database.ref(`AC Celulares/Control/Clientes/${this.valordebusquedaCliente}/Historial de Compras/${tiempo.getDate()}-${this.meses[tiempo.getMonth()]}-${tiempo.getFullYear()},${tiempo.getHours()}:${tiempo.getMinutes()}:${tiempo.getSeconds()}`)
              .set({
                TipoPago: this.tipoPago,
                TotalCordoba: this.totalCordoba(),
                TotalDolar: this.totalDolar(),
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
        Marca: this.producto.Marca,
        Categoria: this.producto.Categoria,
        PCompra: this.producto.PCompra,
        PVenta: this.producto.PVenta
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
  totalDescuento() {
    return this.productos.map(t => t.DescuentoPorUnidad).reduce((acc, value) => acc + value, 0);
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
      if (this.productos.length === 0) {
        this.hayDatosEnTabla = false;
      }
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
