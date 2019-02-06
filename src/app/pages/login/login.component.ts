import { Component, OnInit, ViewChild } from '@angular/core';
import { NavsideComponent } from '../navside/navside.component';

// importacion del servicio
import { ServicioService } from '../../servicios/servicio.service';

// importacion del componente para los toast
import { ToastrService } from 'ngx-toastr';

// importacion de los componentes de las bases de datos para actualizar los datos cada vez que se inicia o se cierra sesion
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument, DocumentSnapshot, Action } from 'angularfire2/firestore';

declare var $: any;

export interface Usuario {
  Nombres: string;
  Apellidos: string;
  Correo: string;
  Pertenece1: boolean;
  Pertenece2: boolean;
  Pertenece3: boolean;
  Tipo: string;
  UID: string;
  Username: string;
  Celular: number;
  Cedula: string;
  EstadoConexion: boolean;
  FechaUltimaConexion: string;
  HoraUltimaConexion: string;
  Cargo: string;
  Contrasena: string;
  PhotoURL: string;
  Sexo: string;
  'Primer Nombre': string;
  'Segundo Nombre': string;
  'Primer Apellido': string;
  'Segundo Apellido': string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // variables de email y password
  email: string;
  password: string;

  // variable para verificar si el login fue correcto o no
  loginCorrecto: boolean;
  errorLogin: string;
  documento: AngularFirestoreDocument<Usuario>;
  constructor(
    public nav: NavsideComponent,
    public servicio: ServicioService,
    public toast: ToastrService,
    public fs: AngularFirestore
  ) {
    this.nav.mostrarNav = false;
  }

  ngOnInit() {
  }

  // funcion para realizar el login
  private login() {
    this.servicio.login(this.email, this.password)
      .then((usuario) => {
        this.fs.doc(`AC Celulares/Control/Usuarios/${this.servicio.auth.auth.currentUser.email}`).update({
          EstadoConexion: true,
          UID: this.servicio.auth.auth.currentUser.uid,
          'Contraseña': this.password
        }).then((response) => {
          console.log('Datos Actualizados Correctamente');
          this.fs.doc(`AC Celulares/Control/Usuarios/${this.servicio.auth.auth.currentUser.email}`)
            .snapshotChanges().subscribe((user: Action<DocumentSnapshot<Usuario>>) => {
              this.nav.nombre = user.payload.data()['Primer Nombre'] + ' ' + user.payload.data()['Primer Apellido'];
              this.nav.photoUrl = user.payload.data().PhotoURL;
              if (user.payload.data().Sexo === 'Masculino') {
                // tslint:disable-next-line:max-line-length
                this.servicio.newToast(1, 'Inicio de Sesión', `Bienvenido ${user.payload.data()['Primer Nombre']} ${user.payload.data()['Primer Apellido']}!`);
              } else {
                // tslint:disable-next-line:max-line-length
                this.servicio.newToast(1, 'Inicio de Sesión', `Bienvenida ${user.payload.data()['Primer Nombre']} ${user.payload.data()['Primer Apellido']}!`);
              }
            });
        }).catch((err) => {
          this.servicio.newToast(0, 'Hubo un error!', err);
          console.error('Error al actualizar los datos de estado de conexion: ' + err);
        });
        this.loginCorrecto = true;
        this.servicio.navegar('dashboard');
        console.warn('Inicio de Sesion Correcto');
      }).catch((err) => {
        this.errorLogin = err;
        console.error(err);
        let errMensajeToast: string = null;
        switch (err.code) {
          case 'auth/argument-error':
            errMensajeToast = 'Revise si esta bien su correo y contraseña y/o rellene los campos';
            break;
          case 'auth/network-request-failed':
            errMensajeToast = 'Hubo un error con la conexion a internet, por favor verifiquela';
            break;
          case 'auth/wrong-password':
            errMensajeToast = 'Contraseña Incorrecta, favor ingrese de nuevo';
            break;
          case 'auth/user-not-found':
            errMensajeToast = 'El correo de usuario que ha ingresado no se encuentra en la base de datos';
            break;
          default:
            errMensajeToast = err;
            break;
        }
        this.servicio.newToast(0, 'Inicio de Sesión Erróneo', `${errMensajeToast}`);
      });
  }
}
