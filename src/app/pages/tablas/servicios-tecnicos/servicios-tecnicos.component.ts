import { HistorialServicio } from './../../../interfaces/historial-servicio';
import { ControlTienda } from './../../../interfaces/control';
import { Component, OnInit, ViewChild } from '@angular/core';

// importacion de los componentes de firestore
// tslint:disable-next-line:max-line-length
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, Action, DocumentSnapshot, DocumentChangeAction, QueryDocumentSnapshot } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';

// importacion de la interfaz para el producto
import { Producto } from '../../../interfaces/producto';

// importacion de la interfaz para los campos de las tiendas
import { CamposTiendas } from '../../../interfaces/campos-tiendas';

// importacion de los componentes de ng-bootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// importacion del servicio
import { ServicioService } from '../../../servicios/servicio.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Cliente } from 'src/app/interfaces/cliente';
import { Usuario } from 'src/app/interfaces/usuario';
import { Observable } from 'rxjs';
import { Servicio } from 'src/app/interfaces/servicio';
import { TipoProductos } from 'src/app/interfaces/ventas/tipo-productos';
import { VentasDiarias } from 'src/app/interfaces/ventas/dia/ventas-diarias';

@Component({
  selector: 'app-servicios-tecnicos',
  templateUrl: './servicios-tecnicos.component.html',
  styleUrls: ['./servicios-tecnicos.component.scss']
})
export class ServiciosTecnicosComponent implements OnInit {

  // variables de tipo observer para paginator y sort
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['Id', 'Nombre', 'TipoServicio', 'Acciones'];
  dataSource: MatTableDataSource<Servicio>;

  // variable que contendra el valor de busqueda dentro de la tabla
  valorBusqueda = '';

  // variable que contendra el tipo de pago
  tipoPago = '';

  // variable que contendra el id del servicio
  idServicio = '';

  // variable que contendra la descripcion del servicio
  Descripcion = '';

  // variable que contendra el nombre del servicio
  nombreServicio = '';

  // variables que contendran los datos del dispositivo a prestarle servicio
  marcaDispositivo = '';
  modeloDispositivo = '';

  // variable que contendra el precio final
  precioFinal = 0;

  // variable que contendra el tipo de servicio
  tipoServicio = '';

  // variables que almacenan los documentos de firestore
  clientes: Observable<Cliente[]>;
  vendedores: Observable<Usuario[]>;

  // variables que almacenaran los valores de busqueda para los documentos de firestore
  valordebusquedaCliente = '';
  valordebusquedaVendedor = '';

  // variable que contendra el total de servicios registrados
  cantidadServicios = 0;

  // variable que contendra el servicio a vender
  servicioVender: Servicio;

  // variable que contendra toda la coleccion de servicios
  coleccionDeServicios: AngularFirestoreCollection<Servicio>;

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
    public db: AngularFireDatabase
  ) {
    this.fs.doc<ControlTienda>('/AC Celulares/Control').snapshotChanges().subscribe(control => {
      this.cantidadServicios = control.payload.data()['Cantidad Total de Servicios'];
      this.reiniciarId();
    });
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
  }

  ngOnInit() {
    this.coleccionDeServicios = this.fs.collection<Servicio>('AC Celulares/Control/Servicios');
    this.coleccionDeServicios.valueChanges().subscribe(servicio => {
      // Assign the data to the data source for the table to render
      this.dataSource = new MatTableDataSource(servicio);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.applyFilter();
    });

    // funciones para ejecutar las busquedas de los clientes y vendedores
    this.buscarVendedor();
    this.buscarClientes();
  }

  // funcion para abrir los modales de manera centrada
  openVerticallyCentered(content: string, servicio: Servicio) {
    this.servicioVender = servicio;
    this.reiniciarId();
    this.ngbModal.open(content, { centered: true });
  }

  // funcion para agregar un nuevo servicio
  agregarServicios() {
    this.fs.doc<Servicio>(`/AC Celulares/Control/Servicios/${this.idServicio}`).set({
      Id: this.idServicio,
      TipoServicio: this.tipoServicio,
      Nombre: this.nombreServicio
    }).then(resp => {
      this.db.database.ref(`/AC Celulares/Control/Servicios/${this.idServicio}`).set({
        Id: this.idServicio,
        TipoServicio: this.tipoServicio,
        Nombre: this.nombreServicio
      }).then(res => {
        this.fs.doc<ControlTienda>('AC Celulares/Control').update({
          'Cantidad Total de Servicios': this.cantidadServicios + 1
        });
        this.servicio.newToast(1, 'Servicio Agregado', 'El servicio se ha agregado correctamente');
      });
    });
  }

  // funcion para vender un servicio
  venderServicios() {
    let cliente: Cliente;
    let vendedor: Usuario;
    this.fs.doc<Usuario>(`AC Celulares/Control/Usuarios/${this.valordebusquedaVendedor}`)
      .snapshotChanges().subscribe(vendedores => vendedor = vendedores.payload.data());
    this.fs.doc<Cliente>(`AC Celulares/Control/Clientes/${this.valordebusquedaCliente}`)
      .snapshotChanges().subscribe(clientes => cliente = clientes.payload.data());
    const tiempo = new Date();
    setTimeout(() => {
      // tslint:disable-next-line:max-line-length
      this.fs.doc<HistorialServicio>(`AC Celulares/Control/Historial de Ventas de Servicios/${tiempo.getDate()}-${this.servicio.meses[tiempo.getMonth()]}-${tiempo.getFullYear()}, ${tiempo.getHours()}:${tiempo.getMinutes()}:${tiempo.getSeconds()}`).set({
        Servicio: this.servicioVender,
        Vendedor: vendedor,
        Cliente: cliente,
        MarcaDispositivo: this.marcaDispositivo,
        ModeloDispositivo: this.modeloDispositivo,
        TipoPago: this.tipoPago,
        Interes: this.tipoPago === 'Efectivo' ? 0 : (this.precioFinal * 5) / 100,
        ManoObra: this.precioFinal,
        Descripcion: this.Descripcion
      }).then(res => {
        // tslint:disable-next-line:max-line-length
        this.servicio.newToast(1, 'Servicio Vendido', `Servicio ${this.idServicio} vendido al cliente ${this.valordebusquedaCliente} correctamente!`);
        if (this.servicioVender.TipoServicio === 'Software') {
          this.fs.doc<Usuario>(`AC Celulares/Control/Usuarios/${this.valordebusquedaVendedor}`).update({
            Flasheos: vendedor.Flasheos + 1,
            TotalAcumulado: vendedor.TotalAcumulado + ((this.precioFinal * 20) / 100)
          });
          // tslint:disable-next-line:max-line-length
          this.datosGananciasDiarioLocal[3] += ((this.precioFinal * 80) / 100) + (this.tipoPago === 'Efectivo' ? 0 : (this.precioFinal * 5) / 100);
          // tslint:disable-next-line:max-line-length
          this.datosGananciasSemanaLocal.Servicio[tiempo.getDay()] += ((this.precioFinal * 80) / 100) + (this.tipoPago === 'Efectivo' ? 0 : (this.precioFinal * 5) / 100);
          // tslint:disable-next-line:max-line-length
          this.datosGananciasAnualesLocal.Servicio[tiempo.getMonth()] += ((this.precioFinal * 80) / 100) + (this.tipoPago === 'Efectivo' ? 0 : (this.precioFinal * 5) / 100);

          this.totalGananciasDia += ((this.precioFinal * 80) / 100) + (this.tipoPago === 'Efectivo' ? 0 : (this.precioFinal * 5) / 100);
          this.totalGananciasSemana += ((this.precioFinal * 80) / 100) + (this.tipoPago === 'Efectivo' ? 0 : (this.precioFinal * 5) / 100);
          this.totalGananciasAnual += ((this.precioFinal * 80) / 100) + (this.tipoPago === 'Efectivo' ? 0 : (this.precioFinal * 5) / 100);


          // tslint:disable-next-line:max-line-length
          this.datosVentasDiarioLocal[3] += this.precioFinal + (this.tipoPago === 'Efectivo' ? 0 : (this.precioFinal * 5) / 100);
          // tslint:disable-next-line:max-line-length
          this.datosVentasSemanaLocal.Servicio[tiempo.getDay()] += this.precioFinal + (this.tipoPago === 'Efectivo' ? 0 : (this.precioFinal * 5) / 100);
          // tslint:disable-next-line:max-line-length
          this.datosVentasAnualFirestore.Servicio[tiempo.getMonth()] += this.precioFinal + (this.tipoPago === 'Efectivo' ? 0 : (this.precioFinal * 5) / 100);

          this.totalVentasDia += this.precioFinal + (this.tipoPago === 'Efectivo' ? 0 : (this.precioFinal * 5) / 100);
          this.totalVentasSemana += this.precioFinal + (this.tipoPago === 'Efectivo' ? 0 : (this.precioFinal * 5) / 100);
          this.totalVentasAnual += this.precioFinal + (this.tipoPago === 'Efectivo' ? 0 : (this.precioFinal * 5) / 100);

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
          this.fs.doc<TipoProductos>(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana${this.servicio.extraerNumeroSemana()}`)
            .update({
              TotalVentas: this.totalVentasSemana,
              Servicio: this.datosVentasSemanaLocal.Servicio
            }).then(resp => {
              // tslint:disable-next-line:max-line-length
              this.db.database.ref(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana${this.servicio.extraerNumeroSemana()}`)
                .update({
                  TotalVentas: this.totalVentasSemana,
                  Servicio: this.datosVentasSemanaLocal.Servicio
                });
            });

          this.fs.doc<TipoProductos>(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno()}`)
            .update({
              Servicio: this.datosVentasAnualesLocal.Servicio,
              TotalVentas: this.totalVentasAnual
            }).then(resp => {
              this.db.database.ref(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno()}`)
                .update({
                  Servicio: this.datosVentasAnualesLocal.Servicio,
                  TotalVentas: this.totalVentasAnual
                });
            });

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

          // se extraen los datos de firestore de la semana actual para mostrarlo en los graficos correctamente
          // tslint:disable-next-line:max-line-length
          this.fs.doc<TipoProductos>(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana${this.servicio.extraerNumeroSemana()}`)
            .update({
              TotalVentas: this.totalGananciasSemana,
              Servicio: this.datosGananciasSemanaLocal.Servicio
            }).then(resp => {
              // tslint:disable-next-line:max-line-length
              this.db.database.ref(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana${this.servicio.extraerNumeroSemana()}`)
                .update({
                  TotalVentas: this.totalGananciasSemana,
                  Servicio: this.datosGananciasSemanaLocal.Servicio
                });
            });

          // se extraen los datos de firestore del mes actual para mostrar en los graficos anuales correctamente
          this.fs.doc<TipoProductos>(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno()}`)
            .update({
              Servicio: this.datosGananciasAnualesLocal.Servicio,
              TotalVentas: this.totalGananciasAnual
            }).then(resp => {
              this.db.database.ref(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno()}`)
                .update({
                  Servicio: this.datosGananciasAnualesLocal.Servicio,
                  TotalVentas: this.totalGananciasAnual
                });
            });
        } else {
          this.fs.doc<Usuario>(`AC Celulares/Control/Usuarios/${this.valordebusquedaVendedor}`).update({
            Reparaciones: vendedor.Reparaciones + 1,
            TotalAcumulado: vendedor.TotalAcumulado + ((this.precioFinal * 50) / 100)
          });


          // tslint:disable-next-line:max-line-length
          this.datosGananciasDiarioLocal[3] += ((this.precioFinal * 50) / 100) + (this.tipoPago === 'Efectivo' ? 0 : (this.precioFinal * 5) / 100);
          // tslint:disable-next-line:max-line-length
          this.datosGananciasSemanaLocal.Servicio[tiempo.getDay()] += ((this.precioFinal * 50) / 100) + (this.tipoPago === 'Efectivo' ? 0 : (this.precioFinal * 5) / 100);
          // tslint:disable-next-line:max-line-length
          this.datosGananciasAnualesLocal.Servicio[tiempo.getMonth()] += ((this.precioFinal * 50) / 100) + (this.tipoPago === 'Efectivo' ? 0 : (this.precioFinal * 5) / 100);

          this.totalGananciasDia += ((this.precioFinal * 50) / 100) + (this.tipoPago === 'Efectivo' ? 0 : (this.precioFinal * 5) / 100);
          this.totalGananciasSemana += ((this.precioFinal * 50) / 100) + (this.tipoPago === 'Efectivo' ? 0 : (this.precioFinal * 5) / 100);
          this.totalGananciasAnual += ((this.precioFinal * 50) / 100) + (this.tipoPago === 'Efectivo' ? 0 : (this.precioFinal * 5) / 100);


          // tslint:disable-next-line:max-line-length
          this.datosVentasDiarioLocal[3] += this.precioFinal + (this.tipoPago === 'Efectivo' ? 0 : (this.precioFinal * 5) / 100);
          // tslint:disable-next-line:max-line-length
          this.datosVentasSemanaLocal.Servicio[tiempo.getDay()] += this.precioFinal + (this.tipoPago === 'Efectivo' ? 0 : (this.precioFinal * 5) / 100);
          // tslint:disable-next-line:max-line-length
          this.datosVentasAnualFirestore.Servicio[tiempo.getMonth()] += this.precioFinal + (this.tipoPago === 'Efectivo' ? 0 : (this.precioFinal * 5) / 100);

          this.totalVentasDia += this.precioFinal + (this.tipoPago === 'Efectivo' ? 0 : (this.precioFinal * 5) / 100);
          this.totalVentasSemana += this.precioFinal + (this.tipoPago === 'Efectivo' ? 0 : (this.precioFinal * 5) / 100);
          this.totalVentasAnual += this.precioFinal + (this.tipoPago === 'Efectivo' ? 0 : (this.precioFinal * 5) / 100);

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
          this.fs.doc<TipoProductos>(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana${this.servicio.extraerNumeroSemana()}`)
            .update({
              TotalVentas: this.totalVentasSemana,
              Servicio: this.datosVentasSemanaLocal.Servicio
            }).then(resp => {
              // tslint:disable-next-line:max-line-length
              this.db.database.ref(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana${this.servicio.extraerNumeroSemana()}`)
                .update({
                  TotalVentas: this.totalVentasSemana,
                  Servicio: this.datosVentasSemanaLocal.Servicio
                });
            });

          this.fs.doc<TipoProductos>(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno()}`)
            .update({
              Servicio: this.datosVentasAnualesLocal.Servicio,
              TotalVentas: this.totalVentasAnual
            }).then(resp => {
              this.db.database.ref(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno()}`)
                .update({
                  Servicio: this.datosVentasAnualesLocal.Servicio,
                  TotalVentas: this.totalVentasAnual
                });
            });

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

          // se extraen los datos de firestore de la semana actual para mostrarlo en los graficos correctamente
          // tslint:disable-next-line:max-line-length
          this.fs.doc<TipoProductos>(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana${this.servicio.extraerNumeroSemana()}`)
            .update({
              TotalVentas: this.totalGananciasSemana,
              Servicio: this.datosGananciasSemanaLocal.Servicio
            }).then(resp => {
              // tslint:disable-next-line:max-line-length
              this.db.database.ref(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana${this.servicio.extraerNumeroSemana()}`)
                .update({
                  TotalVentas: this.totalGananciasSemana,
                  Servicio: this.datosGananciasSemanaLocal.Servicio
                });
            });

          // se extraen los datos de firestore del mes actual para mostrar en los graficos anuales correctamente
          this.fs.doc<TipoProductos>(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno()}`)
            .update({
              Servicio: this.datosGananciasAnualesLocal.Servicio,
              TotalVentas: this.totalGananciasAnual
            }).then(resp => {
              this.db.database.ref(`AC Celulares/Control/Ganancias/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno()}`)
                .update({
                  Servicio: this.datosGananciasAnualesLocal.Servicio,
                  TotalVentas: this.totalGananciasAnual
                });
              this.reiniciarInputs();
            });
        }
      });
    }, 2000);
  }

  // funcion para eliminar el servicio
  eliminarServicio() {
    this.fs.doc(`/AC Celulares/Control/Servicios/${this.servicioVender.Id}`).delete().then(res => {
      this.servicio.newToast(1, 'Servicio Eliminado', `El servicio ${this.servicioVender.Id} se ha eliminado correctamente`);
    }).catch(err => {
      this.servicio.newToast(0, 'Hubo un Error!', err);
    });
  }

  // funcion para reiniciar inputs
  reiniciarInputs() {
    this.reiniciarId();
    this.tipoServicio = '';
    this.nombreServicio = '';
    this.valordebusquedaCliente = '';
    this.valordebusquedaVendedor = '';
  }

  // funcion para buscar producto en la tabla
  applyFilter() {
    this.dataSource.filter = this.valorBusqueda.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // funcion para reiniciar el id del producto
  reiniciarId() {
    this.idServicio = '';
    this.idServicio = 'SERV';
    this.idServicio += this.cantidadServicios + 1;
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

}
