import { Component, OnInit } from '@angular/core';

// se importa el servicio
import { ServicioService } from '../../servicios/servicio.service';

// se importan los componentes para angularfire2
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentSnapshot, Action } from 'angularfire2/firestore';

// se importa la interfaz de usuario
import { Usuario } from './../../interfaces/usuario';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireDatabase } from 'angularfire2/database';

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
  Ventas: number;
  Flasheos: number;
  Reparaciones: number;
  TotalAcumulado: number;

  // variables que contendran las nuevas contraseñas
  contrasena = '';
  confirmarContrasena = '';


  constructor(
    public servicio: ServicioService,
    public fs: AngularFirestore,
    public ngbModal: NgbModal,
    public db: AngularFireDatabase,
  ) {
    this.fs.doc<Usuario>(`/AC Celulares/Control/Usuarios/${this.servicio.auth.auth.currentUser.email}`).snapshotChanges()
      .subscribe((usuario: Action<DocumentSnapshot<Usuario>>) => {
        this.photoURL = usuario.payload.data().PhotoURL;
        this.Nombre = usuario.payload.data()['Primer Nombre'] + ' ' + usuario.payload.data()['Primer Apellido'];
        this.Tipo = usuario.payload.data().Tipo;
        this.Cargo = usuario.payload.data().Cargo;
        this.Ventas = usuario.payload.data().Ventas;
        this.Flasheos = usuario.payload.data().Flasheos;
        this.Reparaciones = usuario.payload.data().Reparaciones;
        this.TotalAcumulado = usuario.payload.data().TotalAcumulado;
      });
  }

  ngOnInit() {
  }

  // funcion para abrir los modales de manera centrada
  openVerticallyCentered(content: string) {
    this.ngbModal.open(content, { centered: true });
  }

  // funcion para cambiar la contraseña
  cambiarContrasena() {
    const usuario = this.servicio.auth.auth.currentUser;
    if (this.contrasena === '') {
      this.servicio.newToast(0, 'Debe de Ingresar una contraseña para continuar', 'El campo de nueva contraseña no puede estar vacio');
    } else if (this.confirmarContrasena === '') {
      // tslint:disable-next-line:max-line-length
      this.servicio.newToast(0, 'Debe de Ingresar una confirmacion de contraseña para continuar', 'El campo de confirmacion de nueva contraseña no puede estar vacio');
    } else if (this.contrasena !== this.confirmarContrasena) {
      this.servicio.newToast(0, 'Deben ser las mismas contraseñas', 'Ambas contraseñas deben de coincidir y ser las mismas');
    } else {
      usuario.updatePassword(this.contrasena).then(resp => {
        this.fs.doc<Usuario>(`/AC Celulares/Control/Usuarios/${this.servicio.auth.auth.currentUser.email}`).update({
          Contrasena: this.contrasena
        }).then(rep => {
          let id = this.servicio.auth.auth.currentUser.email;
          id = id.replace('.', '_');
          this.db.database.ref(`/AC Celulares/Control/Usuarios/${id}`).update({
            Contrasena: this.contrasena
          });
        }).catch(err => {
          console.error(err);
        });
        // tslint:disable-next-line:max-line-length
        this.servicio.newToast(1, 'Contraseña Actualizada Correctamente', `La contraseña para el usuario ${this.servicio.auth.auth.currentUser.email} se ha actualizado correctamente!`);
        setTimeout(() => {
          this.servicio.logout().then(re => {
            this.servicio.newToast(1, 'Contraseña Actualizada Correctamente', 'Vuelva a Iniciar Sesion con su nueva Contraseña');
          }).catch(err => {
            this.servicio.newToast(0, 'Hubo un error', err);
          });
        }, 1000);
      }).catch(err => {
        this.servicio.newToast(0, 'Hubo un error', err);
      });
    }
  }
}
