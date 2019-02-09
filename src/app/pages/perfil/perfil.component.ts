import { Component, OnInit } from '@angular/core';

// se importa el servicio
import { ServicioService } from '../../servicios/servicio.service';

// se importan los componentes para angularfire2
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentSnapshot, Action } from 'angularfire2/firestore';

// se importa la interfaz de usuario
import { Usuario } from './../../interfaces/usuario';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  // variables para el control de los datos del usuario
  photoURL: string;
  Nombre: string;
  Tipo: string;
  Cargo: string;

  constructor(
    public servicio: ServicioService,
    public fs: AngularFirestore
  ) {
    this.fs.doc(`/AC Celulares/Control/Usuarios/${this.servicio.auth.auth.currentUser.email}`).snapshotChanges()
      .subscribe((usuario: Action<DocumentSnapshot<Usuario>>) => {
        this.photoURL = usuario.payload.data().PhotoURL;
        this.Nombre = usuario.payload.data()['Primer Nombre'] + ' ' + usuario.payload.data()['Primer Apellido'];
        this.Tipo = usuario.payload.data().Tipo;
        this.Cargo = usuario.payload.data().Cargo;
      });
  }

  ngOnInit() {
  }

}
