import { Component, OnInit, ViewChild } from '@angular/core';

// se importan los componentes para la tabla
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

// se importan las interfaces
import { Factura } from './../../../interfaces/factura';

// importacion de los componentes de firestore
// tslint:disable-next-line:max-line-length
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, Action, DocumentSnapshot, DocumentChangeAction, QueryDocumentSnapshot } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';

// se importa el servicio
import { ServicioService } from 'src/app/servicios/servicio.service';

// importacion de los componentes de ng-bootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tabla-historial-facturas',
  templateUrl: './tabla-historial-facturas.component.html',
  styleUrls: ['./tabla-historial-facturas.component.scss']
})
export class TablaHistorialFacturasComponent implements OnInit {

  // variable que contendra el valor de busqueda en la trabla
  valorBusqueda = '';

  // variables de tipo observer para paginator y sort
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['Id', 'Fecha', 'Hora', 'Cliente', 'Vendedor', 'Total', 'Descripcion'];
  dataSource: MatTableDataSource<Factura>;

  // variable que contendra la factura para ver
  factura: Factura = null;

  // variable que contendra la coleccion de facturas
  coleccionFacturas: AngularFirestoreCollection<Factura>;

  constructor(
    public ngbModal: NgbModal,
    public fs: AngularFirestore,
    public servicio: ServicioService,
    public db: AngularFireDatabase
  ) {
    // Se extraen todos los productos ingresados
    this.coleccionFacturas = this.fs.collection<Factura>(`/AC Celulares/Control/Facturas/${this.servicio.tienda}/Historial de Facturas`);
    this.coleccionFacturas.valueChanges().subscribe(factura => {
      // Assign the data to the data source for the table to render
      this.dataSource = new MatTableDataSource(factura);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.applyFilter();
    });
  }

  ngOnInit() {
  }

  // funcion para buscar producto en la tabla
  applyFilter() {
    this.dataSource.filter = this.valorBusqueda.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // funcion para abrir los modales de manera centrada
  openVerticallyCentered(content: string, factura: Factura) {
    this.factura = factura;
    this.ngbModal.open(content, { centered: true });
  }

}
