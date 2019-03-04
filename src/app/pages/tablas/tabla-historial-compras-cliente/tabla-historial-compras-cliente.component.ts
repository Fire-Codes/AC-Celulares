import { Component, OnInit, ViewChild } from '@angular/core';

// se importa el servicio
import { ServicioService } from 'src/app/servicios/servicio.service';

// importacion de los componentes para las tablas
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';

// se importa el componente para los modales
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// se importan las interfaces
import { Cliente } from 'src/app/interfaces/cliente';
import { HistorialCompra } from 'src/app/interfaces/historial-compra';

// importacion de los componentes de la base de datos
// tslint:disable-next-line:max-line-length
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, Action, DocumentSnapshot, DocumentChangeAction } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';


@Component({
  selector: 'app-tabla-historial-compras-cliente',
  templateUrl: './tabla-historial-compras-cliente.component.html',
  styleUrls: ['./tabla-historial-compras-cliente.component.scss']
})
export class TablaHistorialComprasClienteComponent implements OnInit {
  public cliente: Cliente;
  public productosComprados: HistorialCompra = null;

  // variables que contienen el observable del paginator y del sort de la tabla
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // se declaran las variables que contendran los datos de la base de datos
  coleccionDeComprascliente: AngularFirestoreCollection<HistorialCompra>;

  // variables para las columnas de la tabla de los clientes y de los datos de la tabla para los clientes
  displayedColumns: string[] = ['Fecha', 'Hora', 'Interes', 'TotalCordoba', 'TipoPago', 'Acciones'];
  dataSource: MatTableDataSource<HistorialCompra>;

  constructor(
    public servicio: ServicioService,
    public fs: AngularFirestore,
    public db: AngularFireDatabase,
    public ngbModal: NgbModal
  ) {
    this.cliente = this.servicio.ClienteVerCompras;
  }

  ngOnInit() {
    // se extraen todos los clientes ingresados para guardarlos en la variable que contendra los clientes en la tabla
    // tslint:disable-next-line:max-line-length
    this.coleccionDeComprascliente = this.fs.collection<HistorialCompra>(`AC Celulares/Control/Clientes/${this.cliente.Id}/Historial de Compras`);
    this.coleccionDeComprascliente.valueChanges().subscribe(compras => {
      // se le asignan los datos a la variable de los datos de la tabla de clientes cada vez que haya un cambio
      this.dataSource = new MatTableDataSource(compras);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  // funcion para ver los productos comprados
  verProductosCompradoss(content: string, compra: HistorialCompra) {
    this.ngbModal.open(content, { centered: true });
    this.productosComprados = compra;
  }

}
