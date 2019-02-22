import { Component, OnInit } from '@angular/core';

// importacion del componente del navside
import { NavsideComponent } from '../navside/navside.component';

// se importa AngularFirestore
import { AngularFirestore, Action, DocumentSnapshot } from 'angularfire2/firestore';

// importacion de interfaces
import { Usuario } from './../../interfaces/usuario';

// importacion del servicio
import { ServicioService } from 'src/app/servicios/servicio.service';

@Component({
  selector: 'app-seleccionar-plataforma',
  templateUrl: './seleccionar-plataforma.component.html',
  styleUrls: ['./seleccionar-plataforma.component.scss']
})
export class SeleccionarPlataformaComponent implements OnInit {

  // variables que contendran a que tienda pertenece
  tienda1 = false;
  tienda2 = false;
  tienda3 = false;

  constructor(
    public nav: NavsideComponent,
    public servicio: ServicioService,
    public fs: AngularFirestore
  ) {
    this.nav.mostrarNav = false;
    this.fs.doc(`AC Celulares/Control/Usuarios/${this.servicio.auth.auth.currentUser.email}`).snapshotChanges()
      .subscribe((usuario: Action<DocumentSnapshot<Usuario>>) => {
        this.tienda1 = usuario.payload.data().Pertenece1;
        this.tienda2 = usuario.payload.data().Pertenece2;
        this.tienda3 = usuario.payload.data().Pertenece3;
      });
  }

  ngOnInit() {
  }

  // funcion para seleccionar la tienda deseada
  seleccionarTienda(tienda: string) {
    this.servicio.tienda = tienda;
    setTimeout(() => {
      this.servicio.navegar('dashboard');
    }, 1000);
  }

}
