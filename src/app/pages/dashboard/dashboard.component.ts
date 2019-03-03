import { Component, OnInit, ViewChild } from '@angular/core';

// importacion del componente del NavSide
import { NavsideComponent } from '../navside/navside.component';

// importacion del Chart.js
import { Chart } from 'chart.js';

// importacoin del servicio
import { ServicioService } from '../../servicios/servicio.service';

// se importa los componentes de la base de datos
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';

// importacion de las interfaces
import { VentasMensuales } from './../../interfaces/ventas/mes/ventas-mensuales';
import { VentasDiarias } from './../../interfaces/ventas/dia/ventas-diarias';
import { TipoProductos } from './../../interfaces/ventas/tipo-productos';

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

  pushVentasSemana: TipoProductos;
  pushVentasMensuales: VentasMensuales;
  pushVentasDiarias: VentasDiarias;



  constructor(
    public nav: NavsideComponent,
    public servicio: ServicioService,
    public fs: AngularFirestore,
    public db: AngularFireDatabase
  ) {

    this.pushVentasSemana = {
      TotalVentas: 0,
      Accesorios: [0, 0, 0, 0, 0, 0, 0],
      Repuestos: [0, 0, 0, 0, 0, 0, 0],
      Celulares: [0, 0, 0, 0, 0, 0, 0],
      Servicio: [0, 0, 0, 0, 0, 0, 0],
      Herramientas: [0, 0, 0, 0, 0, 0, 0]
    };
    this.pushVentasMensuales = {
      TotalVentasAnuales: 0,
      Enero: {
        TotalVentas: 0,
        Accesorios: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Repuestos: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Celulares: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Servicio: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Herramientas: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      Febrero: {
        TotalVentas: 0,
        Accesorios: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Repuestos: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Celulares: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Servicio: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Herramientas: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      Marzo: {
        TotalVentas: 0,
        Accesorios: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Repuestos: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Celulares: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Servicio: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Herramientas: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      Abril: {
        TotalVentas: 0,
        Accesorios: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Repuestos: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Celulares: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Servicio: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Herramientas: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      Mayo: {
        TotalVentas: 0,
        Accesorios: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Repuestos: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Celulares: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Servicio: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Herramientas: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      Junio: {
        TotalVentas: 0,
        Accesorios: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Repuestos: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Celulares: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Servicio: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Herramientas: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      Julio: {
        TotalVentas: 0,
        Accesorios: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Repuestos: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Celulares: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Servicio: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Herramientas: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      Agosto: {
        TotalVentas: 0,
        Accesorios: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Repuestos: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Celulares: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Servicio: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Herramientas: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      Septiembre: {
        TotalVentas: 0,
        Accesorios: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Repuestos: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Celulares: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Servicio: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Herramientas: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      Octubre: {
        TotalVentas: 0,
        Accesorios: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Repuestos: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Celulares: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Servicio: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Herramientas: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      Noviembre: {
        TotalVentas: 0,
        Accesorios: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Repuestos: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Celulares: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Servicio: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Herramientas: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      Diciembre: {
        TotalVentas: 0,
        Accesorios: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Repuestos: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Celulares: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Servicio: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Herramientas: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
    };
    this.pushVentasDiarias = {
      Accesorios: 0,
      Repuestos: 0,
      Celulares: 0,
      Servicio: 0,
      Herramientas: 0
    };

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

    // se muestra el numero de la semana
    console.warn('El numero de Semana actual es: ' + this.servicio.extraerNumeroSemana());


    // mostrar el navside
    this.nav.mostrarNav = true;

    // se manda a llamar a la funcion para mostrar la hora
    this.extraerFechaHora();
  }

  ngOnInit() {
    const tiempo = new Date();

    // se suben los datos a firestore
    if (this.servicio.extraerNumeroSemana() === 52) {
      // tslint:disable-next-line:max-line-length
      this.fs.doc<TipoProductos>(`/AC Celulares/Control/Ventas/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno() + 1}/Datos/Semana1`).set(this.pushVentasSemana)
        .then(res => {
          // tslint:disable-next-line:max-line-length
          this.db.database.ref(`/AC Celulares/Control/Ventas/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno() + 1}/Datos/Semana1`).set(this.pushVentasSemana);
        });
      // tslint:disable-next-line:max-line-length
      this.fs.doc<TipoProductos>(`/AC Celulares/Control/Ventas/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana53`).set(this.pushVentasSemana)
        .then(res => {
          // tslint:disable-next-line:max-line-length
          this.db.database.ref(`/AC Celulares/Control/Ventas/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana53`).set(this.pushVentasSemana);
        });
    } else if (this.servicio.extraerNumeroSemana() === 53) {
      // tslint:disable-next-line:max-line-length
      this.fs.doc<TipoProductos>(`/AC Celulares/Control/Ventas/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno() + 1}/Datos/Semana1`).set(this.pushVentasSemana)
        .then(res => {
          // tslint:disable-next-line:max-line-length
          this.db.database.ref(`/AC Celulares/Control/Ventas/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno() + 1}/Datos/Semana1`).set(this.pushVentasSemana);
        });
    } else {
      // tslint:disable-next-line:max-line-length
      this.fs.doc<TipoProductos>(`/AC Celulares/Control/Ventas/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana${this.servicio.extraerNumeroSemana() + 1}`).set(this.pushVentasSemana)
        .then(res => {
          // tslint:disable-next-line:max-line-length
          this.db.database.ref(`/AC Celulares/Control/Ventas/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana${this.servicio.extraerNumeroSemana() + 1}`).set(this.pushVentasSemana);
        });
    }

    // tslint:disable-next-line:max-line-length
    this.fs.doc<VentasMensuales>(`/AC Celulares/Control/Ventas/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno() + 1}`).set(this.pushVentasMensuales)
      .then(res => {
        // tslint:disable-next-line:max-line-length
        this.db.database.ref(`/AC Celulares/Control/Ventas/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno() + 1}`).set(this.pushVentasMensuales);
      });

    if ((tiempo.getMonth() === 11) && (tiempo.getDate() === 31)) {
      // tslint:disable-next-line:max-line-length
      this.fs.doc<VentasDiarias>(`/AC Celulares/Control/Ventas/${this.servicio.tienda}/Diarias/${this.servicio.extraerAno() + 1}/Datos/1-Enero-${tiempo.getFullYear() + 1}`).set(this.pushVentasDiarias)
        .then(res => {
          // tslint:disable-next-line:max-line-length
          this.db.database.ref(`/AC Celulares/Control/Ventas/${this.servicio.tienda}/Diarias/${this.servicio.extraerAno() + 1}/Datos/1-Enero-${tiempo.getFullYear() + 1}`).set(this.pushVentasDiarias);
        });
    } else if (((tiempo.getMonth() === 2) && (tiempo.getDate() === 28)) || ((tiempo.getMonth() === 2) && (tiempo.getDate() === 29))) {
      // tslint:disable-next-line:max-line-length
      this.fs.doc<VentasDiarias>(`/AC Celulares/Control/Ventas/${this.servicio.tienda}/Diarias/${this.servicio.extraerAno()}/Datos/1-Marzo-${tiempo.getFullYear()}`).set(this.pushVentasDiarias)
        .then(res => {
          // tslint:disable-next-line:max-line-length
          this.db.database.ref(`/AC Celulares/Control/Ventas/${this.servicio.tienda}/Diarias/${this.servicio.extraerAno()}/Datos/1-Marzo-${tiempo.getFullYear()}`).set(this.pushVentasDiarias);
        });
    } else if ((tiempo.getDate() === 30) || (tiempo.getDate() === 31)) {
      // tslint:disable-next-line:max-line-length
      this.fs.doc<VentasDiarias>(`/AC Celulares/Control/Ventas/${this.servicio.tienda}/Diarias/${this.servicio.extraerAno()}/Datos/1-${this.meses[tiempo.getMonth() + 1]}-${tiempo.getFullYear()}`).set(this.pushVentasDiarias)
        .then(res => {
          // tslint:disable-next-line:max-line-length
          this.db.database.ref(`/AC Celulares/Control/Ventas/${this.servicio.tienda}/Diarias/${this.servicio.extraerAno()}/Datos/1-${this.meses[tiempo.getMonth() + 1]}-${tiempo.getFullYear()}`).set(this.pushVentasDiarias);
        });
    } else {
      // tslint:disable-next-line:max-line-length
      this.fs.doc<VentasDiarias>(`/AC Celulares/Control/Ventas/${this.servicio.tienda}/Diarias/${this.servicio.extraerAno()}/Datos/${tiempo.getDate() + 1}-${this.servicio.meses[tiempo.getMonth()]}-${this.servicio.extraerAno()}`).set(this.pushVentasDiarias)
        .then(res => {
          // tslint:disable-next-line:max-line-length
          this.db.database.ref(`/AC Celulares/Control/Ventas/${this.servicio.tienda}/Diarias/${this.servicio.extraerAno()}/Datos/${tiempo.getDate() + 1}-${this.servicio.meses[tiempo.getMonth()]}-${this.servicio.extraerAno()}`).set(this.pushVentasDiarias);
        });
    }

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
          data: this.pushVentasDiarias,
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
        labels: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
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
