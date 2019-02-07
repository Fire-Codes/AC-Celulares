import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as $ from 'jquery';

// importacion del servicio
import { ServicioService } from '../../servicios/servicio.service';

// importacion de la interfaz para el usuario
import { Usuario } from '../../interfaces/usuario';

// importacion de los componentes de firestore
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentSnapshot, Action } from 'angularfire2/firestore';


@Component({
  selector: 'app-navside',
  templateUrl: './navside.component.html',
  styleUrls: ['./navside.component.scss']
})
export class NavsideComponent implements OnInit {
  mostrarNav = true;
  abierto = false;
  panel: any;
  nombre: string;
  photoUrl: string;
  meses: string[] = [
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
  ];
  constructor(
    public router: Router,
    private servicio: ServicioService,
    public fs: AngularFirestore
  ) {
    console.log(this.router.url);
    /*if ((this.router.url === '/') || (this.router.url === '/ingresar') || this.router.url === '/plataforma') {
      this.mostrarNav = false;
    } else if ((this.router.url === 'dashboard')) {
      this.mostrarNav = true;
    }*/
  }

  ngOnInit() {
    this.panel = document.getElementById('sidenavPanel');
  }

  navegar(ruta: string) {
    this.servicio.navegar(ruta);
  }
  imprimir() {
    // window.print();
  }
  abrirCerrar() {
    if (this.abierto) {
      /*$('#sidenavPanel').removeClass('sidePanelAbierto');
      $('#sidenavPanel').addClass('sidePanelCerrado');*/
      this.panel.classList.remove('sidePanelAbierto');
      this.panel.classList.add('sidePanelCerrado');
      this.abierto = false;
    } else {
      /*$('#sidenavPanel').removeClass('sidePanelCerrado');
      $('#sidenavPanel').addClass('sidePanelAbierto');*/
      this.panel.classList.remove('sidePanelCerrado');
      this.panel.classList.add('sidePanelAbierto');
      this.abierto = true;
    }
  }

  // funcion para cerrar sesion
  logout() {
    const tiempo = new Date();
    const mes = this.meses[tiempo.getMonth()];
    const dia = tiempo.getDate();
    const ano = tiempo.getFullYear();
    const hora = tiempo.getHours();
    const minutos = tiempo.getMinutes();
    const segundos = tiempo.getSeconds();
    const email = this.servicio.auth.auth.currentUser.email;
    let nombre;
    this.fs.doc(`AC Celulares/Control/Usuarios/${email}`).snapshotChanges()
      .subscribe((user: Action<DocumentSnapshot<Usuario>>) => {
        nombre = user.payload.data()['Primer Nombre'] + ' ' + user.payload.data()['Primer Apellido'];
      });
    this.servicio.logout().then((res) => {
      console.log('Se ha cerrado sesion correctamente');
      this.fs.doc(`AC Celulares/Control/Usuarios/${email}`).update({
        EstadoConexion: false,
        FechaUltimaConexion: `${dia}, ${mes} de ${ano}`,
        HoraUltimaConexion: `${hora}:${minutos}:${segundos}`
      }).then((response) => {
        console.log('Estado de conexion actualizado correctamente');
        this.servicio.newToast(1, 'Cerrando Sesion!', `Adios ${nombre}, vuelva pronto!`);
      }).catch((err) => {
        this.servicio.newToast(0, 'Hubo un Error!', err);
        console.error('Ha habido un error al actualizar los datos del estado de la conexion: ' + err);
      });
      this.navegar('');
    }).catch((err) => {
      this.servicio.newToast(0, 'Hubo un Error!', err);
      console.error('Ha habido un problema al cerrar sesion: ' + err);
    });
  }
}
