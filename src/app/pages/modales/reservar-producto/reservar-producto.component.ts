import { ProductoReservado } from './../../../interfaces/producto-reservado';
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
import { NgbModal, NgbCalendar, NgbDateStruct, NgbPeriod } from '@ng-bootstrap/ng-bootstrap';

// importacion de los componentes de la base de datos
import { AngularFirestore, Action, DocumentSnapshot } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';
import { SeleccionarProductoComponent } from '../seleccionar-producto/seleccionar-producto.component';
import { MatTableDataSource, MatSort } from '@angular/material';
import { ControlTienda } from 'src/app/interfaces/control';
import { HistorialCompra } from 'src/app/interfaces/historial-compra';

@Component({
  selector: 'app-reservar-producto',
  templateUrl: './reservar-producto.component.html',
  styleUrls: ['./reservar-producto.component.scss']
})


export class ReservarProductoComponent implements OnInit {

  // variable que almacenara la fecha en la cual se debe de ir a retirar el producto
  plazo: NgbDateStruct;


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

  // variable que almacenara el tipo de pago a efectuar
  tipoPago = '';

  // variable que contendra el total de interes segun el tipo de pago
  interes = 0;

  // variable que contendra el restante para el producto
  restante = 0;

  // variable que contendra la fecha del retiro del producto
  // tslint:disable-next-line:no-inferrable-types
  fechaRetiro: string = '';

  // variable que contendra las compras actuales del cliente
  totalComprasActualesCliente: number;

  // variable que contendra la fecha actual
  cuotaReserva = 0;

  // variables que almacenan los documentos de firestore
  clientes: Observable<Cliente[]>;
  vendedores: Observable<Usuario[]>;

  // variables que almacenaran los valores de busqueda para los documentos de firestore
  valordebusquedaCliente = '';
  valordebusquedaVendedor = '';

  // variables para calculos de reserva
  cantidadReservar: 0;

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
    public ngbModal: NgbModal,
    public calendar: NgbCalendar
  ) { }

  ngOnInit() {
    // se manda a inicializar los datos para los autocomplete de los clientes y vendedores
    this.buscarClientes();
    this.buscarVendedor();
    this.restante = this.producto.PVenta;
  }

  // funcion para calcular el restante del producto
  calcularRestante() {
    if (this.cuotaReserva === 0) {
      this.calcularInteres();
    } else if ((this.cuotaReserva === 0) && (this.tipoPago === 'Tarjeta')) {
      this.calcularInteres();
    } else {
      this.restante = (this.producto.PVenta + this.interes) - this.cuotaReserva;
    }
  }

  // funcion para calcular el interes
  calcularInteres() {
    switch (this.tipoPago) {
      case 'Efectivo':
        this.interes = 0;
        this.restante = (this.producto.PVenta + this.interes) - this.cuotaReserva;
        break;
      case 'Tarjeta':
        this.interes = (this.producto.PVenta * 5) / 100;
        this.restante = (this.producto.PVenta + this.interes) - this.cuotaReserva;
        break;
      default:
        break;
    }
  }

  // funcion para realizar la reservacion
  realizarReservacion() {
    const tiempo = new Date();
    const fechaActual = new Date(tiempo.getFullYear(), tiempo.getMonth(), tiempo.getDate());
    fechaActual.setHours(tiempo.getHours());
    fechaActual.setMinutes(tiempo.getMinutes());
    fechaActual.setSeconds(tiempo.getSeconds());
    const fechaRetiro = new Date(this.fechaRetiro);
    fechaRetiro.setHours(23);
    fechaRetiro.setMinutes(59);
    fechaRetiro.setSeconds(59);
    let cantidadReservas;
    let existenciasProducto;
    let cliente: Cliente;
    let vendedor: Usuario;
    // this.nav.mostrarNav = false;
    if ((this.valordebusquedaCliente === '') || (this.valordebusquedaVendedor === '')) {
      this.servicio.newToast(0, 'Error de Reservación', 'Debe de ingresar un Cliente y un Vendedor');
    } else if (this.producto.Existencia === 0) {
      this.servicio.newToast(0, 'Error de Reservación', 'No quedan mas productos en Stock para reservarlo');
    } else if (this.fechaRetiro === '') {
      this.servicio.newToast(0, 'Error de Reservación', 'Debe de Ingresar una Fecha de Retiro');
    } else if (this.cuotaReserva < ((this.producto.PVenta + this.interes) / 2)) {
      // tslint:disable-next-line:max-line-length
      this.servicio.newToast(0, 'Error de Reservación', 'La cuota de reserva del producto debe ser mayor o igual al 50% sobre el precio del mismo mas su interés');
    } else if (fechaActual > fechaRetiro) {
      this.servicio.newToast(0, 'Error de Reservación', 'La fecha de retiro no puede ser menor a la fecha actual');
    } else if (this.cuotaReserva > this.producto.PVenta) {
      this.servicio.newToast(0, 'Error de Reservación', 'La cuota de reserva no puede ser mayor al precio del producto más su interés');
    } else {

      // se leen los productos reservados actuales del cliente y la cantidad en existencia del producto
      this.fs.doc<Cliente>(`AC Celulares/Control/Clientes/${this.valordebusquedaCliente}`).snapshotChanges()
        .subscribe(clienteDoc => {
          cantidadReservas = clienteDoc.payload.data().CantidadReservas;
          cliente = clienteDoc.payload.data();
        });

      // se guarda toda la informacion del usuario que lo vendio
      this.fs.doc<Usuario>(`AC Celulares/Control/Usuarios/${this.valordebusquedaVendedor}`).snapshotChanges()
        .subscribe(usuario => {
          vendedor = usuario.payload.data();
        });

      // se guardan las existencias del producto seleccionado para su posterior update
      this.fs.doc<Producto>(`AC Celulares/Control/Inventario/${this.servicio.tienda}/Productos/${this.producto.Id}`).snapshotChanges()
        .subscribe(producto => {
          existenciasProducto = producto.payload.data().Existencia;
        });

      // se espera 1 segundo para que la ejecucion del codigo anterior se realice y se guarde correctamente
      setTimeout(() => {
        // se guardan primero los datos en el control de reservaciones para posteriormente guardarlos en el historial de cada cliente
        // tslint:disable-next-line:max-line-length
        this.fs.doc<ProductoReservado>(`AC Celulares/Control/Reservaciones/${this.servicio.tienda}/Reservas/${tiempo.getDate()}-${this.meses[tiempo.getMonth()]}-${tiempo.getFullYear()},${tiempo.getHours()}:${tiempo.getMinutes()}:${tiempo.getSeconds()}`).set({
          Cliente: cliente,
          Vendedor: vendedor,
          Producto: this.producto,
          PrecioUnidad: this.producto.PVenta,
          TipoPago: this.tipoPago,
          Interes: this.interes,
          FechaReserva: fechaActual,
          FechaRetiro: fechaRetiro,
          Restante: this.restante,
          Estado: 'Pendiente'
        }).then(respons => {
          // tslint:disable-next-line:max-line-length
          this.db.database.ref(`AC Celulares/Control/Reservaciones/${this.servicio.tienda}/Reservas/${tiempo.getDate()}-${this.meses[tiempo.getMonth()]}-${tiempo.getFullYear()},${tiempo.getHours()}:${tiempo.getMinutes()}:${tiempo.getSeconds()}`).set({
            Cliente: cliente,
            Vendedor: vendedor,
            Producto: this.producto,
            PrecioUnidad: this.producto.PVenta,
            TipoPago: this.tipoPago,
            Interes: this.interes,
            FechaReserva: `${fechaActual}`,
            FechaRetiro: `${fechaRetiro}`,
            Restante: this.restante,
            Estado: 'Pendiente'
          }).then(re => {
            // tslint:disable-next-line:max-line-length
            this.fs.doc<ProductoReservado>(`AC Celulares/Control/Clientes/${this.valordebusquedaCliente}/Historial de Reservas/${tiempo.getDate()}-${this.meses[tiempo.getMonth()]}-${tiempo.getFullYear()},${tiempo.getHours()}:${tiempo.getMinutes()}:${tiempo.getSeconds()}`)
              .set({
                Cliente: cliente,
                Vendedor: vendedor,
                Producto: this.producto,
                PrecioUnidad: this.producto.PVenta,
                TipoPago: this.tipoPago,
                Interes: this.interes,
                FechaReserva: fechaActual,
                FechaRetiro: fechaRetiro,
                Restante: this.restante,
                Estado: 'Pendiente'
              }).then((res) => {
                this.fs.doc<Producto>(`AC Celulares/Control/Inventario/${this.servicio.tienda}/Productos/${this.producto.Id}`).update({
                  Existencia: existenciasProducto - 1
                });
                this.fs.doc<Cliente>(`AC Celulares/Control/Clientes/${this.valordebusquedaCliente}`).update({
                  CantidadReservas: cantidadReservas + 1
                }).then(respo => {
                  // tslint:disable-next-line:max-line-length
                  this.db.database.ref(`AC Celulares/Control/Clientes/${this.valordebusquedaCliente}/Historial de Reservas/${tiempo.getDate()}-${this.meses[tiempo.getMonth()]}-${tiempo.getFullYear()},${tiempo.getHours()}:${tiempo.getMinutes()}:${tiempo.getSeconds()}`)
                    .set({
                      Cliente: cliente,
                      Vendedor: vendedor,
                      Producto: this.producto,
                      PrecioUnidad: this.producto.PVenta,
                      TipoPago: this.tipoPago,
                      Interes: this.interes,
                      FechaReserva: `${fechaActual}`,
                      FechaRetiro: `${fechaRetiro}`,
                      Restante: this.restante,
                      Estado: 'Pendiente'
                    }).then(resp => {
                      this.db.database.ref(`AC Celulares/Control/Inventario/${this.servicio.tienda}/Productos/${this.producto.Id}`).update({
                        Existencia: existenciasProducto - 1
                      }).then(response => {
                        this.db.database.ref(`AC Celulares/Control/Clientes/${this.valordebusquedaCliente}`).update({
                          CantidadReservas: cantidadReservas + 1
                        }).then(respon => {
                          // tslint:disable-next-line:max-line-length
                          this.servicio.newToast(1, 'Reservación Generada al Cliente Correctamente', 'Se agregó el producto al historial de reservaciones del cliente correctamente');
                          this.limpiarTodo();
                          this.cerrarModal();
                        });
                      });
                    });
                });
              }).catch(err => {
                this.servicio.newToast(0, 'Error de Reserva', err);
              });
          });
        }).catch(err => {
          this.servicio.newToast(0, 'Hubo un Error', err);
        });
      }, 1000);
    }
    // setTimeout(() => {
    // return xepOnline.Formatter.Format('content', { render: 'download' });
    // window.print();
    // }, 1000);
  }

  // funcion que se ejecutara una vez qu la factura se haya pagado
  limpiarTodo() {
    this.valordebusquedaCliente = '';
    this.valordebusquedaVendedor = '';
    this.cantidadReservar = 0;
    this.fechaRetiro = '';
    this.tipoPago = '';
    this.interes = 0;
    this.producto = null;
    this.restante = 0;
    this.cuotaReserva = 0;
  }

  // funcion para cerra el modal
  cerrarModal() {
    this.cerrarModalVentaRapida.emit();
  }

  // funcion para abrir los modales de manera centrada
  openVerticallyCentered(content: string) {
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
