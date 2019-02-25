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

// se añade la interfaz del producto Reservado
import { ProductoReservado } from './../../../interfaces/producto-reservado';
import { Timestamp } from '@google-cloud/firestore';
import { Producto } from 'src/app/interfaces/producto';


@Component({
  selector: 'app-sistema-apartado',
  templateUrl: './sistema-apartado.component.html',
  styleUrls: ['./sistema-apartado.component.scss']
})
export class SistemaApartadoComponent implements OnInit {
  // variable que contendra el cliente seleccionado para realizar acciones con el
  productoReservado: ProductoReservado = null;

  // variables que contienen el observable del paginator y del sort de la tabla
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // variable observadora de la base de datos que se le asignara a la variable de los datos de la tabla para los clientes
  coleccionDeReservas: AngularFirestoreCollection<ProductoReservado>;

  // variables para las columnas de la tabla de los clientes y de los datos de la tabla para los clientes
  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = ['Cliente', 'Telefono', 'Producto', 'precioProducto', 'Restante', 'fechaReserva', 'fechaRetiro', 'Estado', 'Acciones'];
  dataSource: MatTableDataSource<ProductoReservado>;

  constructor(
    public ngbModal: NgbModal,
    public fs: AngularFirestore,
    public db: AngularFireDatabase,
    public servicio: ServicioService
  ) {

    // se extraen todos los clientes ingresados para guardarlos en la variable que contendra los clientes en la tabla
    this.coleccionDeReservas = this.fs.collection<ProductoReservado>(`AC Celulares/Control/Reservaciones/${this.servicio.tienda}/Reservas`);
    this.coleccionDeReservas.valueChanges().subscribe(reserva => {
      // se le asignan los datos a la variable de los datos de la tabla de clientes cada vez que haya un cambio
      this.dataSource = new MatTableDataSource(reserva);
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


  // funcion para vender el producto y unarchivarlo
  unArchivarProductoReservado() {
    this.fs.doc<ProductoReservado>(`AC Celulares/Control/Reservaciones/${this.servicio.tienda}/Reservas/${this.productoReservado.Id}`)
      .update({
        Estado: 'Retirado',
        Restante: 0
      }).then(res => {
        this.db.database.ref(`AC Celulares/Control/Reservaciones/${this.servicio.tienda}/Reservas/${this.productoReservado.Id}`)
          .update({
            Estado: 'Retirado',
            Restante: 0
          }).then(resp => {
            this.servicio.newToast(1, 'Venta Realizada Correctamente', 'El producto reservado se retiró y se vendió correctamente');
          });
      }).catch(err => {
        this.servicio.newToast(0, 'Hubo un Error!', err);
      });
  }


  // funcion para eliminar el producto de la lista de reservaciones
  eliminarProductoReservados() {
    if (this.productoReservado.Estado === 'Retirado') {
      this.fs.doc<ProductoReservado>(`AC Celulares/Control/Reservaciones/${this.servicio.tienda}/Reservas/${this.productoReservado.Id}`)
        .delete().then(res => {
          this.db.database.ref(`AC Celulares/Control/Reservaciones/${this.servicio.tienda}/Reservas/${this.productoReservado.Id}`)
            .remove().then(resp => {
              // tslint:disable-next-line:max-line-length
              this.servicio.newToast(1, 'Producto Eliminado de la Lista Correctamente', 'El producto se eliminó de la lista de reservaciones correctamente');
            });
        }).catch(err => {
          this.servicio.newToast(0, 'Hubo un Error!', err);
        });
    } else {
      // tslint:disable-next-line:max-line-length
      this.servicio.newToast(0, 'Error de Eliminación', 'No puede eliminar un producto que aun esta en estado pendiente, por favor cancele o venda la reservacion e intente de nuevo');
    }
  }

  // funcion para cancelar la reservacion
  cancelarReservacion() {
    // se extrae la cantidad actual de productos para sumarle 1
    let cantidadProductosActual;
    this.fs.doc<Producto>(`AC Celulares/Control/Inventario/${this.servicio.tienda}/Productos/${this.productoReservado.Producto.Id}`)
      .snapshotChanges().subscribe(producto => {
        cantidadProductosActual = producto.payload.data().Existencia;
      });

    // se espera 1 segundo para ejecutar el codigo posterior
    setTimeout(() => {
      this.fs.doc<Producto>(`AC Celulares/Control/Inventario/${this.servicio.tienda}/Productos/${this.productoReservado.Producto.Id}`)
        .update({ Existencia: cantidadProductosActual + 1 }).then(res => {
          // tslint:disable-next-line:max-line-length
          this.fs.doc<ProductoReservado>(`/AC Celulares/Control/Reservaciones/${this.servicio.tienda}/Reservas/${this.productoReservado.Id}`)
            .update({ Estado: 'Cancelado' });
          this.db.database.ref(`AC Celulares/Control/Inventario/${this.servicio.tienda}/Productos/${this.productoReservado.Producto.Id}`)
            .update({ Existencia: cantidadProductosActual + 1 }).then(resp => {
              // tslint:disable-next-line:max-line-length
              this.db.database.ref(`/AC Celulares/Control/Reservaciones/${this.servicio.tienda}/Reservas/${this.productoReservado.Id}`)
                .update({ Estado: 'Cancelado' });
            }).then(re => {
              this.servicio.newToast(1, 'Cancelación con Éxito', 'La cancelación del producto se realizo correctamente');
            });
        }).catch(err => {
          this.servicio.newToast(0, 'Hubo un Error!', err);
        });
    }, 1000);
  }

  // funcion para abrir los modales de manera centrada
  openVerticallyCentered(content: string, productoReservado: ProductoReservado) {
    this.productoReservado = productoReservado;
    setTimeout(() => {
      this.ngbModal.open(content, { centered: true });
    }, 1000);
  }

  // funcion para extraer la fecha de reserva
  extraerFechaReserva(fechaReserva: ProductoReservado) {
    return `${fechaReserva.DiaReserva}/${fechaReserva.MesReserva}/${fechaReserva.AnoReserva}`;
  }

  // funcion para extraer la fecha de retiro
  extraerFechaRetiro(fechaRetiro: ProductoReservado) {
    return `${fechaRetiro.DiaRetiro}/${fechaRetiro.MesRetiro}/${fechaRetiro.AnoRetiro}`;
  }
}
