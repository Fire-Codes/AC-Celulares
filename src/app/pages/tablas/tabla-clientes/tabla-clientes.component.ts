import { Component, OnInit, ViewChild } from '@angular/core';

// importacion de los componentes para las tablas
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// importacion de los componentes de firestore
// tslint:disable-next-line:max-line-length
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, Action, DocumentSnapshot, DocumentChangeAction } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';

// importacion del componente del servicio
import { ServicioService } from './../../../servicios/servicio.service';

// importacion de la interfaz de los clientes
import { Cliente } from 'src/app/interfaces/cliente';

// importacion de la interfaz del control de la tienda
import { ControlTienda } from 'src/app/interfaces/control';

@Component({
  selector: 'app-tabla-clientes',
  templateUrl: './tabla-clientes.component.html',
  styleUrls: ['./tabla-clientes.component.scss']
})
export class TablaClientesComponent implements OnInit {

  // variable que contendra el cliente seleccionado para realizar acciones con el
  cliente: Cliente = null;
  cantidadDeComprasCliente: number;
  tieneCedula = false;
  tieneCorreo = false;
  primerNombre = '';
  primerApellido = '';
  segundoNombre = '';
  segundoApellido = '';

  // variable que contendra la cantidad total de los clientes almacenados en la base de datos
  contadorClientes: number;

  // variables que contienen el observable del paginator y del sort de la tabla
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // variable observadora de la base de datos que se le asignara a la variable de los datos de la tabla para los clientes
  coleccionDeClientes: AngularFirestoreCollection<Cliente>;

  // variables para las columnas de la tabla de los clientes y de los datos de la tabla para los clientes
  displayedColumns: string[] = ['Nombres', 'Apellidos', 'Telefono', 'Tipo', 'Cedula', 'Acciones'];
  dataSource: MatTableDataSource<Cliente>;

  constructor(
    public ngbModal: NgbModal,
    public fs: AngularFirestore,
    public db: AngularFireDatabase,
    public servicio: ServicioService
  ) {

    // se extrae la cantidad total de clientes almacenados
    this.fs.doc('AC Celulares/Control').snapshotChanges()
      .subscribe((control: Action<DocumentSnapshot<ControlTienda>>) => {
        this.contadorClientes = control.payload.data()['Contador de Clientes'];
        console.log('Cantidad de Clientes almacenados actualmente: ' + this.contadorClientes);
      });

    // se extraen todos los clientes ingresados para guardarlos en la variable que contendra los clientes en la tabla
    this.coleccionDeClientes = this.fs.collection<Cliente>('AC Celulares/Control/Clientes');
    this.coleccionDeClientes.valueChanges().subscribe(cliente => {
      // se le asignan los datos a la variable de los datos de la tabla de clientes cada vez que haya un cambio
      this.dataSource = new MatTableDataSource(cliente);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

  }

  ngOnInit() {
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // funcion para ver el historial de compras
  verHistorialComprasCliente(cliente: Cliente) {
    // se asigna el cliente de la tabla a la variable de servicio para ver sus datos posteriormente
    this.servicio.ClienteVerCompras = cliente;

    // se navega al componente para ver los detalles de compra
    this.servicio.navegar('detallesCompra');
  }

  // funcion para abrir los modales de manera centrada
  openVerticallyCentered(content: string, cliente: Cliente) {
    this.ngbModal.open(content, { centered: true });
    if (!(cliente === null)) {
      this.cliente = cliente;
      this.cantidadDeComprasCliente = cliente['Cantidad de Compras'];
      this.primerNombre = cliente['Primer Nombre'];
      this.primerApellido = cliente['Primer Apellido'];
      this.segundoNombre = cliente['Segundo Nombre'];
      this.segundoApellido = cliente['Segundo Apellido'];
      if (cliente.Cedula === null) {
        this.tieneCedula = false;
      } else {
        this.tieneCedula = true;
      }
      if (cliente.Correo === null) {
        this.tieneCorreo = false;
      } else {
        this.tieneCorreo = true;
      }
    }
  }

  // funcion para eliminar el cliente
  eliminarClientes() {
    const contadorClientes = this.contadorClientes - 1;
    this.fs.doc(`AC Celulares/Control/Clientes/${this.cliente.Id}`).delete().then(res => {
      this.servicio.newToast(1, 'Eliminación de cliente correcta', 'El cliente se ha eliminado correctamente');
      this.db.database.ref(`AC Celulares/Control/Clientes/${this.cliente.Id}`).remove();
      // tslint:disable-next-line:max-line-length
      this.db.database.ref('AC Celulares/Control').update({ 'Cantidad de Clientes': contadorClientes, 'Contador de Clientes': contadorClientes });
      this.fs.doc('AC Celulares/Control').update({ 'Cantidad de Clientes': contadorClientes, 'Contador de Clientes': contadorClientes });
    }).catch(err => {
      this.servicio.newToast(0, 'Eliminación de cliente incorrecta', err);
    });
  }

  // funcion para editar los datos de un cliente
  editarClientes() {
    this.fs.doc(`AC Celulares/Control/Clientes/${this.cliente.Id}`).update(this.cliente)
      .then(response => {
        this.servicio.newToast(1, 'Modificacion Correcta', `El Cliente ${this.cliente.Id} se ha modificado con éxito`);
      }).catch(err => {
        this.servicio.newToast(0, 'Modificacion Incorrecta', err);
      });

    // integracion con el realtime database
    this.db.database.ref(`AC Celulares/Control/Clientes/${this.cliente.Id}`).update(this.cliente);
  }

  // funcion para hacer mayusculas el texto ingresado
  toUpper() {
    this.cliente.Cedula = this.cliente.Cedula.toUpperCase();
  }

}
