import { Component, OnInit, ViewChild } from '@angular/core';

// importacion del componente del NavSide
import { NavsideComponent } from '../navside/navside.component';

// importacion del Chart.js
import { Chart } from 'chart.js';

// importacoin del servicio
import { ServicioService } from '../../servicios/servicio.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  // variable que determina en que plataforma esta
  plataforma = '';

  // variable que contendra el string de la fecha y hora
  fechaHora = '';

  // variable que contendra todos los meses
  // tslint:disable-next-line:max-line-length
  meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  // variable que contendra todos los dias de la semana
  diasSemana: string[] = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  @ViewChild('graficoPastelCanvas') graficoPastelCanvas;
  @ViewChild('graficoBarraCanvas') graficoBarraCanvas;
  @ViewChild('graficoLineaCanvas') graficoLineaCanvas;

  graficoPastelChart: any;
  graficoBarraChart: any;
  graficoLineaChart: any;



  constructor(
    public nav: NavsideComponent,
    public servicio: ServicioService
  ) {

    this.nav.mostrarNav = true;

    // le asigna el valor a la plataforma segun la tienda en la que se encuentra
    switch (this.servicio.tienda) {
      case 'Tienda Principal':
        this.plataforma = '';
        break;
      case 'Tienda 2':
        this.plataforma = 'Tienda 2';
        break;
      case 'Tienda 3':
        this.plataforma = 'Tienda 3';
        break;
      default:
        this.plataforma = '';
        break;
    }

    // mostrar el navside
    this.nav.mostrarNav = true;

    // se manda a llamar a la funcion para mostrar la hora
    this.extraerFechaHora();
  }

  ngOnInit() {
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

  // funcion para extraer la fecha y la hora a cada segundo
  extraerFechaHora() {
    setInterval(() => {
      const fechaHora = new Date();
      if ((fechaHora.getHours() >= 0) && (fechaHora.getHours() <= 12)) {
        // tslint:disable-next-line:max-line-length
        this.fechaHora = `${this.diasSemana[fechaHora.getDay()]} ${fechaHora.getDate()} de ${this.meses[fechaHora.getMonth()]} del ${fechaHora.getFullYear()} | ${fechaHora.getHours()}:${fechaHora.getMinutes()}:${fechaHora.getSeconds()} AM`;
      } else if (fechaHora.getHours() > 12) {
        // tslint:disable-next-line:max-line-length
        this.fechaHora = `${this.diasSemana[fechaHora.getDay()]} ${fechaHora.getDate()} de ${this.meses[fechaHora.getMonth()]} del ${fechaHora.getFullYear()} | ${fechaHora.getHours() - 12}:${fechaHora.getMinutes()}:${fechaHora.getSeconds()} PM`;
      }
    }, 1000);
  }
}
