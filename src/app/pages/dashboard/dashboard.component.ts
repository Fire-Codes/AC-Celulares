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

  @ViewChild('graficoPastelCanvas') graficoDiaCanvas;
  @ViewChild('graficoBarraCanvas') graficoSemanaCanvas;
  @ViewChild('graficoLineaCanvas') graficoAnualCanvas;

  graficoDiaChart: any;
  graficoSemanaChart: any;
  graficoAnualChart: any;

  // variables que contendran los datos que se enviaran a firestore cada vez que alguien se meta al dashboard o inicie sesion
  pushVentasSemana: TipoProductos;
  pushVentasMensuales: TipoProductos;
  pushVentasDiarias: VentasDiarias;

  // variables que contendra los datos del grafico semanal
  public datosSemanaFirestore: TipoProductos;
  public datosSemanaLocal: TipoProductos;
  public totalVentasSemana = 0;

  // variables que contendran los datos del grafico anual
  public datosAnualFirestore: TipoProductos;
  public datosAnualesLocal: TipoProductos;
  public totalVentasAnual = 0;

  // variables que contendran los datos del grafico diario
  public datosDiarioFirestore: VentasDiarias;
  public datosDiarioLocal: number[];
  public totalVentasDia = 0;



  constructor(
    public nav: NavsideComponent,
    public servicio: ServicioService,
    public fs: AngularFirestore,
    public db: AngularFireDatabase
  ) {

    const tiempo = new Date();

    // se extraen los datos de firestore de la semana actual para mostrarlo en los graficos correctamente
    // tslint:disable-next-line:max-line-length
    this.fs.doc<TipoProductos>(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana${this.servicio.extraerNumeroSemana()}`)
      .snapshotChanges().subscribe(semana => {
        this.datosSemanaFirestore = semana.payload.data();
        this.datosSemanaLocal = this.datosSemanaFirestore;
        this.totalVentasSemana = semana.payload.data().TotalVentas;
        setTimeout(() => {
          this.generarGraficoSemana();
        }, 1000);
      });

    // se extraen los datos de firestore del mes actual para mostrar en los graficos anuales correctamente
    this.fs.doc<TipoProductos>(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno()}`)
      .snapshotChanges().subscribe(anuales => {
        this.datosAnualFirestore = anuales.payload.data();
        this.datosAnualesLocal = this.datosAnualFirestore;
        this.totalVentasAnual = anuales.payload.data().TotalVentas;
        setTimeout(() => {
          this.generarGraficoAnual();
        }, 1000);
      });

    // se extraen los datos de firestore del dia actual para mostrar en los graficos diarios correctamente
    // tslint:disable-next-line:max-line-length
    this.fs.doc<VentasDiarias>(`AC Celulares/Control/Ventas/${this.servicio.tienda}/Diarias/${this.servicio.extraerAno()}/Datos/${tiempo.getDate()}-${this.servicio.meses[tiempo.getMonth()]}-${tiempo.getFullYear()}`)
      .snapshotChanges().subscribe(diario => {
        this.datosDiarioFirestore = diario.payload.data();
        this.datosDiarioLocal = this.datosDiarioFirestore.Datos;
        this.totalVentasDia = diario.payload.data().TotalVentas;
        setTimeout(() => {
          this.generarGraficoDiario();
        }, 1000);
      });


    // se generan las variables para posteriormente mandarlas a llamar desde su respectivo grafico
    this.pushVentasSemana = {
      TotalVentas: 0,
      Accesorios: [0, 0, 0, 0, 0, 0, 0],
      Repuestos: [0, 0, 0, 0, 0, 0, 0],
      Celulares: [0, 0, 0, 0, 0, 0, 0],
      Servicio: [0, 0, 0, 0, 0, 0, 0],
      Herramientas: [0, 0, 0, 0, 0, 0, 0]
    };
    this.pushVentasMensuales = {
      TotalVentas: 0,
      Accesorios: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      Repuestos: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      Celulares: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      Servicio: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      Herramientas: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    };
    this.pushVentasDiarias = {
      Datos: [0, 0, 0, 0, 0],
      TotalVentas: 0
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
    // mostrar el navside
    this.nav.mostrarNav = true;

    // se manda a llamar a la funcion para mostrar la hora
    this.extraerFechaHora();
  }

  ngOnInit() {
    const tiempo = new Date();

    // se realizan las tomas de decisiones y se suben los datos a firestore para el grafico semanal y su correcto funcionamiento
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

    // se actualizan los datos del año siguiente al actual para su mejor funcionamiento
    // tslint:disable-next-line:max-line-length
    this.fs.doc<TipoProductos>(`/AC Celulares/Control/Ventas/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno() + 1}`).set(this.pushVentasMensuales)
      .then(res => {
        // tslint:disable-next-line:max-line-length
        this.db.database.ref(`/AC Celulares/Control/Ventas/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno() + 1}`).set(this.pushVentasMensuales);
      });

    // se realizan las tomas de deciiones y se suben los datos a firestore para el grafico anual y su correcto funcionamiento
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

  // funcion para generar el grafico de la semana actual
  generarGraficoSemana() {
    this.graficoSemanaChart = new Chart(this.graficoSemanaCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        datasets: [
          {
            label: 'Accesorios',
            data: this.datosSemanaLocal.Accesorios,
            // data: this.pushVentasSemana.Accesorios,
            backgroundColor: '#007bff'
          },
          {
            label: 'Repuestos',
            data: this.datosSemanaLocal.Repuestos,
            // data: this.pushVentasSemana.Repuestos,
            backgroundColor: '#28a745'
          },
          {
            label: 'Celulares',
            data: this.datosSemanaLocal.Celulares,
            // data: this.pushVentasSemana.Celulares,
            backgroundColor: '#17a2b8'
          },
          {
            label: 'Servicio',
            data: this.datosSemanaLocal.Servicio,
            // data: this.pushVentasSemana.Servicio,
            backgroundColor: '#ffc107'
          },
          {
            label: 'Herramientas',
            data: this.datosSemanaLocal.Herramientas,
            // data: this.pushVentasSemana.Herramientas,
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
  }

  // funcion para generar el grafico anual actual
  generarGraficoAnual() {
    this.graficoAnualChart = new Chart(this.graficoAnualCanvas.nativeElement, {
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
            data: this.datosAnualesLocal.Accesorios,
            borderColor: '#007bff',
            fill: false
          },
          {
            label: 'Repuestos',
            data: this.datosAnualesLocal.Repuestos,
            borderColor: '#28a745',
            fill: false
          },
          {
            label: 'Celulares',
            data: this.datosAnualesLocal.Celulares,
            borderColor: '#17a2b8',
            fill: false
          },
          {
            label: 'Servicio',
            data: this.datosAnualesLocal.Servicio,
            borderColor: '#ffc107',
            fill: false
          },
          {
            label: 'Herramientas',
            data: this.datosAnualesLocal.Herramientas,
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

  // funcion para generar el grafico del dia actual
  generarGraficoDiario() {
    this.graficoDiaChart = new Chart(this.graficoDiaCanvas.nativeElement, {

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
          data: this.datosDiarioLocal,
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
  }
}
