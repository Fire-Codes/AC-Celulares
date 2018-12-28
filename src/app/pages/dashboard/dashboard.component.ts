import { Component, OnInit, ViewChild } from '@angular/core';

// importacion del Chart.js
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('graficoPastelCanvas') graficoPastelCanvas;
  @ViewChild('graficoBarraCanvas') graficoBarraCanvas;
  @ViewChild('graficoLineaCanvas') graficoLineaCanvas;

  graficoPastelChart: any;
  graficoBarraChart: any;
  graficoLineaChart: any;

  constructor() { }

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

}
