import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';


export interface UserData {
  id: string;
  Nombre: string;
  Telefono: string;
  Tipo: string;
  Cedula: String;
}
/** Constants used to fill up our data base. */
const TIPO: string[] = ['Estándar', 'Premium'];
const NAMES: string[] = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
  'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
  'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];
const CEDULAS: String[] = [
  '944695402-00007', '020803516-00002',
  '981501042-00007', '022641732-00007',
  '718640204-00001', '387853823-00004',
  '328070107-00003', '851325969-00000',
  '197015530-00003', '285322137-00008',
  '605097260-00000', '068294073-00009',
  '179035332-00008', '005857743-00008',
  '711063453-00007', '320708803-00004',
  '921615290-00001', '193059854-00003',
  '260491097-00002', '424573699-00008',
  '111317111-00008', '889431946-00009',
  '094523693-00003', '611575176-00007',
  '539360487-00000', '024817967-00003',
  '451258727-00002', '992481556-00007',
  '215115551-00008', '498668417-00005',
  '670763424-00009', '514921162-00004',
  '150662963-00001', '473084457-00000',
  '380617886-00003', '179203260-00007',
  '920969342-00004', '248716987-00008',
  '414273094-00006', '633006358-00004',
  '862457298-00001', '020768933-00002',
  '629745449-00005', '003566502-00005',
  '039424551-00008', '176500122-00005',
  '252367347-00009', '157348012-00004',
  '709137384-00000', '683597157-00000',
  '309614337-00009', '080216112-00005',
  '116806191-00007', '876827239-00008',
  '551955958-00006', '001681857-00007',
  '791186380-00006', '460947724-00007',
  '138937826-00004', '534825112-00004',
  '176114734-00005', '031062664-00003',
  '423890680-00006', '278592878-00005',
  '169902582-00009', '806333910-00008',
  '973594393-00009', '713474823-00000',
  '386595656-00003', '521357483-00002',
  '653490664-00006', '909262891-00007',
  '374490654-00000', '169764404-00003',
  '813882271-00006', '649367513-00003',
  '010860377-00000', '937830446-00004',
  '884036443-00007', '025837097-00002',
  '912849379-00009', '129170320-00003',
  '009921560-00000', '612467662-00005',
  '675992028-00000', '520210451-00008',
  '140030420-00008', '628536609-00009',
  '463804831-00006', '211363114-00003',
  '327624367-00006', '959403478-00008',
  '938264199-00002', '781329503-00002',
  '651122459-00001', '142088954-00003',
  '964165302-00008', '823383237-00000',
  '636533804-00002', '408267060-00007',
];


@Component({
  selector: 'app-creditos',
  templateUrl: './creditos.component.html',
  styleUrls: ['./creditos.component.scss']
})
export class CreditosComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['id', 'Nombre', 'Telefono', 'Tipo', 'Cedula', 'Acciones'];
  dataSource: MatTableDataSource<UserData>;
  detallesCliente: UserData = null;
  mostrarDetallesCliente: Boolean = false;

  constructor(
    public ngbModal: NgbModal,
    public router: Router
  ) {
    // Create 100 users
    const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // funcion para abrir los modales de manera centrada
  openVerticallyCentered(content: string) {
    this.ngbModal.open(content, { centered: true });
  }

  // se abre la pagina para ver los detalles del credito de las persones
  verDetallesCredito(content: string, cliente: UserData) {
    // this.router.navigate(['/detallesCredito'], { queryParams: { cliente: JSON.stringify(cliente) } });
    this.ngbModal.open(content, { centered: true });
    console.log('Mostrando detalles del credito' + cliente.id);
    this.detallesCliente = cliente;
    this.mostrarDetallesCliente = true;
  }

  cerrarDetalles() {
    this.detallesCliente = null;
    this.mostrarDetallesCliente = false;
  }

}

/** Builds and returns a new User. */
function createNewUser(id: number): UserData {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

  return {
    id: id.toString(),
    Nombre: name,
    Telefono: '8' + Math.round(Math.random() * 9999999).toString(),
    Tipo: TIPO[Math.round(Math.random() * (TIPO.length - 1))],
    Cedula: CEDULAS[Math.round(Math.random() * (CEDULAS.length - 1))]
  };
}
