import { Component, OnInit, ViewChild } from '@angular/core';

// importacion del componente del NavSide
import { NavsideComponent } from '../navside/navside.component';

// importacion del Chart.js
import { Chart } from 'chart.js';

// importacoin del servicio
import { ServicioService } from '../../servicios/servicio.service';

// importacion de los componentes para las tablas
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';

export interface UserData {
  id: string;
  Nombre: string;
  Telefono: string;
  Tipo: string;
}
/** Constants used to fill up our data base. */
const TIPO: string[] = ['Estándar', 'Premium'];
const NAMES: string[] = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
  'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
  'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('graficoPastelCanvas') graficoPastelCanvas;
  @ViewChild('graficoBarraCanvas') graficoBarraCanvas;
  @ViewChild('graficoLineaCanvas') graficoLineaCanvas;

  graficoPastelChart: any;
  graficoBarraChart: any;
  graficoLineaChart: any;

  displayedColumns: string[] = ['id', 'Nombre', 'Telefono', 'Tipo'];
  dataSource: MatTableDataSource<UserData>;


  constructor(
    public nav: NavsideComponent,
    public servicio: ServicioService
  ) {
    // mostrar el navside
    this.nav.mostrarNav = true;

    // Create 100 users
    const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
  }

  ngOnInit() {
    // this.servicio.newToast(1, 'Inicio de Sesión Correcto', `Bienvenido! ${this.servicio.auth.auth.currentUser.email}`);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.graficoPastelChart = new Chart(this.graficoPastelCanvas.nativeElement, {

      type: 'doughnut',
      data: {
        labels: [
          'Accesorios',
          'Repuestos',
          'Celulares',
          'Servicio',
          'Herramientas'
        ],
        datasets: [{
          label: 'Lunes',
          data: [10, 20, 30, 40, 50],
          backgroundColor: [
            '#007bff',
            '#28a745',
            '#17a2b8',
            '#ffc107',
            '#dc3545'
          ],
          hoverBackgroundColor: [
            '#007bff',
            '#28a745',
            '#17a2b8',
            '#ffc107',
            '#dc3545'
          ]
        }
        ]
      }
    });

    this.graficoBarraChart = new Chart(this.graficoBarraCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        datasets: [
          {
            label: 'Accesorios',
            data: [10, 11, 12, 13, 14, 15, 16],
            backgroundColor: '#007bff'
          },
          {
            label: 'Repuestos',
            data: [20, 25, 30, 35, 40, 45, 50],
            backgroundColor: '#28a745'
          },
          {
            label: 'Celulares',
            data: [33, 34, 36, 37, 39, 47, 9],
            backgroundColor: '#17a2b8'
          },
          {
            label: 'Servicio',
            data: [44, 46, 48, 52, 54, 100, 56],
            backgroundColor: '#ffc107'
          },
          {
            label: 'Herramientas',
            data: [130, 3, 200, 29, 23, 8, 22],
            backgroundColor: '#dc3545'
          }
        ]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
    this.graficoLineaChart = new Chart(this.graficoLineaCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: [
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
        ],
        datasets: [
          {
            label: 'Accesorios',
            data: [10, 11, 12, 13, 14, 15, 16, 10, 11, 12, 13, 14],
            borderColor: '#007bff',
            fill: false
          },
          {
            label: 'Repuestos',
            data: [20, 25, 30, 35, 40, 45, 50, 20, 25, 30, 35, 40],
            borderColor: '#28a745',
            fill: false
          },
          {
            label: 'Celulares',
            data: [33, 34, 36, 37, 39, 47, 9, 33, 34, 36, 37, 39],
            borderColor: '#17a2b8',
            fill: false
          },
          {
            label: 'Servicio',
            data: [44, 46, 48, 52, 54, 100, 56, 44, 46, 48, 52, 54],
            borderColor: '#ffc107',
            fill: false
          },
          {
            label: 'Herramientas',
            data: [130, 3, 200, 29, 23, 8, 22, 130, 3, 200, 29, 23],
            borderColor: '#dc3545',
            fill: false
          }
        ]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
    Telefono: '8' + Math.round(Math.random() * 99999999).toString(),
    Tipo: TIPO[Math.round(Math.random() * (TIPO.length - 1))]
  };
}
