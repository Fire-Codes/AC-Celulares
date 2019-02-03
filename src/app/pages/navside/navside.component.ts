import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as $ from 'jquery';

// importacion del servicio
import { ServicioService } from '../../servicios/servicio.service';

// importacion de los componentes de firestore
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';


@Component({
  selector: 'app-navside',
  templateUrl: './navside.component.html',
  styleUrls: ['./navside.component.scss']
})
export class NavsideComponent implements OnInit {
  mostrarNav = true;
  abierto = false;
  panel: any;
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
    this.fs.doc(`AC Celulares/Control/Usuarios/${this.servicio.auth.auth.currentUser.email}`).update({
      EstadoConexion: false
    }).then((response) => {
      console.log('Estado de conexion actualizado correctamente');
      this.servicio.newToast(1, 'Cerrando Sesion!', `Adios ${this.servicio.auth.auth.currentUser.email}, vuelva pronto!`);
      this.servicio.logout().then((res) => {
        console.log('Se ha cerrado sesion correctamente');
        this.navegar('');
      }).catch((err) => {
        this.servicio.newToast(0, 'Hubo un Error!', err);
        console.error('Ha habido un problema al cerrar sesion: ' + err);
      });
    }).catch((err) => {
      this.servicio.newToast(0, 'Hubo un Error!', err);
      console.error('Ha habido un error al actualizar los datos del estado de la conexion: ' + err);
    });
  }
}
